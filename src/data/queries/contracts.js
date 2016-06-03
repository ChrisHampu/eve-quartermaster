/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */
import fetchXML from '../../core/fetchXML';
import ContractListType from '../types/ContractListType';
import { eve } from '../../config.js';
import { stationIDToName } from '../../constants/stationIDToName';
import verifySession from '../../core/verifySession';
import { getAllRequests, fulfillRequest } from './requests.js';
import { getContractItems } from './contract_items.js';

const url = `https://api.eveonline.com/corp/Contracts.xml.aspx?keyID=${eve.corp_key}&vCode=${eve.corp_vcode}`;

let contractList = [];
let lastFetchTask;
let nextFetch = new Date(Date.now());

// After each new contract pull from the API, this function will run async
// and check if the contracts fulfill any requests
async function checkFulfilledRequests(contracts) {

  console.log("Beginning task to check for request fulfillment.");
  console.time('request_fulfillment');

  const requests = await getAllRequests();

  // Filter out fulfilled requests. TODO: getAllRequests() should instead filter at the SQL query level
  requests.filter((request) => {
    return request.status !== 'full';
  });

  for (const contract of contracts) {

    try {

      // Make sure its an item exchange contract
      if (contract.type !== 0) {
        continue;
      }

      let items = [];

      try {
        // Pull contract items from EVE API
        const res = await getContractItems(contract.id);
        items = res.itemList;

      } catch (err) {
        items = [];
      }

      for (const request of requests) {

        // Check if this request hasn't been already fulfilled
        if (request.status === 'full') {
          continue;
        }

        // Must be at same location
        if (stationIDToName[contract.startStationID] !== request.station) {
          continue;
        }

        // Need to first properly group together request items
        // There could be duplicate name entries with different amounts
        const requestItems = [];

        for (const item of request.items) {

          const idx = requestItems.findIndex((it) => {
            return item.name === it.typeName;
          });

          if (idx === -1) {
            requestItems.push({ name: item.name, count: item.count });
          } else {
            requestItems[idx].count += item.count;
          }
        }

        let matched = 0;

        // Now loop through request + contract items together
        for (const item of requestItems) {

          // Check for name match
          const idx = items.findIndex((it) => {
            return item.name === it.typeName;
          });

          if (idx === -1) {
            break;
          }

          // Check if same number if items in request & contract
          if (parseInt(items[idx].quantity) !== item.count) {
            break;
          }

          matched++;
        }

        // Make sure the same amount of items are in the request & contract
        if (matched === items.length && matched === request.items.length) {

          // TODO: Remove when no longer needed as testing output
          console.log(`Fulfilled request "${request.title}" with ID ${request.id}`);

          // TODO: There is currently no support for partial fulfillment or fulfilling requests for multiple contracts
          // For tracking in this loop (making sure not fulfilled more than once)
          request.status = 'full';

          // Query database to update contract status
          fulfillRequest(request, 'full');
        }
      }
    } catch (err) {
      console.log("Error while fulfilling request:");
      console.log(err);
    }
  }

  console.log("Finished request fulfillment check. Time taken:");
  console.timeEnd('request_fulfillment');
}

function filterCorporation(contracts, session) { // eslint-disable-line no-unused-vars

  return contracts.filter((contract) => {
    return process.env.NODE_ENV === 'development' || contract.public || (contract.forCorp === '1' && parseInt(contract.issuerCorpID) === session.passport.user.corp_id);
  });
}

const contracts = {

  type: ContractListType,
  async resolve(_, __, session) {

    const auth = await verifySession(session);

    if (!auth.authenticated) {
      return { contractList: [] };
    }

    if (lastFetchTask) {
      return lastFetchTask;
    }

    if ((new Date(Date.now())) > nextFetch) {

      console.log("Beginning task to fetch contracts.");
      console.time('fetch_contracts');

      lastFetchTask = new fetchXML(url) // eslint-disable-line new-cap
      .getXML()
      .then(({ xml }) => {

        contractList = [];

        if (xml.eveapi.error === undefined) {
          let contract; // eslint-disable-line vars-on-top

          for (contract of xml.eveapi.result[0].rowset[0].row) {

            const c = contract.$;

            contractList.push({
              id: c.contractID,
              issuerID: c.issuerID,
              issuerCorpID: c.issuerCorpID,
              assigneeID: c.assigneeID,
              acceptorID: c.acceptorID,
              stationName: stationIDToName[c.startStationID],
              startStationID: c.startStationID,
              endStationID: c.endStationID,
              type: eve.contractType[c.type],
              status: eve.contractStatus[c.status],
              title: c.title,
              forCorp: c.forCorp,
              public: c.availability === 'Public' ? 1 : 0,
              dateIssued: c.dateIssued,
              dateExpired: c.dateExpired,
              dateAccepted: c.dateAccepted,
              numDays: c.numDays,
              dateCompleted: c.dateCompleted,
              price: c.price,
              reward: c.reward,
              collateral: c.collateral,
              buyout: c.buyout,
              volume: c.volume
            });
          }
        }

        nextFetch = new Date(Date.parse(`${xml.eveapi.cachedUntil} UTC`));

        lastFetchTask = null;

        console.log("Finished fetching contracts. Time taken:");
        console.timeEnd('fetch_contracts');

        checkFulfilledRequests(contractList);

        return { contractList: filterCorporation(contractList, session) };
      });

      if (contractList.length) {
        return { contractList: filterCorporation(contractList, session) };
      }

      return lastFetchTask;
    }

    return { contractList: filterCorporation(contractList, session) };
  },
};

export default contracts;
