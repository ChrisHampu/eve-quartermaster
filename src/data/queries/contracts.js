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

const url = `https://api.eveonline.com/corp/Contracts.xml.aspx?keyID=${eve.corp_key}&vCode=${eve.corp_vcode}`;

let contractList = [];
let lastFetchTask;
let nextFetch = new Date(Date.now());

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
