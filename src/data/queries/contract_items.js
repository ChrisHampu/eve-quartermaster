/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { GraphQLInt as IntType } from 'graphql';
import fetchXML from '../../core/fetchXML';
import ContractItemListType from '../types/ContractItemListType';
import { eve } from '../../config.js';
import verifySession from '../../core/verifySession';

const contractItemUrl = `https://api.eveonline.com/corp/ContractItems.xml.aspx?keyID=${eve.corp_key}&vCode=${eve.corp_vcode}&contractID=`;
const typeNameUrl = `https://api.eveonline.com/eve/TypeName.xml.aspx?ids=`; // eslint-disable-line quotes

const typeNameCache = new Map();
const contractItemCache = new Map(); // Contract items are basically cached permanently as they will not change
const fetchTaskCache = new Map();

// Takes an array of EVE type IDs and resolves them to type names using the EVE api
// It batches as much as possible to avoid a large number of requests to the api
// Each type name is cached after its retrieved to facilitate rate limiting
async function getTypeNames(typeIDs) {

  const names = [];
  const requests = [];

  // First check IDs against cache
  typeIDs.forEach((id) => {

    const name = typeNameCache.get(id);

    if (name) {
      names.push({ id: id, name: name });
    } else {
      // If not cached, place into list that needs to be queried
      requests.push(parseInt(id)); // XML api takes the id as an integer
    }

  });

  // For remaining, create an XML request
  if (requests.length) {

    const ids = requests.join(',');

    const url = `${typeNameUrl}${ids}`;

    const resp = await new fetchXML(url).getXML(); // eslint-disable-line new-cap

    if (resp.xml.eveapi.error === undefined) {
      var name; // eslint-disable-line vars-on-top no-var

      for (name of resp.xml.eveapi.result[0].rowset[0].row) {

        typeNameCache.set(name.$.typeID, name.$.typeName);

        names.push({ id: name.$.typeID, name: name.$.typeName });
      }
    }
  }

  return names;
}

const contractItems = {

  type: ContractItemListType,
  args: {
    id: { type: IntType }
  },
  async resolve(_, { id }, session) {

    const auth = await verifySession(session);

    if (!auth.authenticated) {
      return { itemList: [] };
    }

    const result = contractItemCache.get(id);

    if (result) {
      return { itemList: result };
    }

    const fetchTask = fetchTaskCache.get(id);

    if (fetchTask) {
      return fetchTask;
    }

    const newFetchTask = new fetchXML(`${contractItemUrl}${id}`) // eslint-disable-line new-cap
      .getXML()
      .then(async ({ xml }) => {

        const items = [];

        if (xml.eveapi.error === undefined) {

          const typeIDs = [];
          var item;

          for (item of xml.eveapi.result[0].rowset[0].row) {

            items.push({
              id: item.$.recordID,
              typeID: item.$.typeID,
              quantity: item.$.quantity,
              typeName: "Unknown"
            });

            typeIDs.push(item.$.typeID);
          }

          // Retrieve a mapping of type id -> type name using local cache + eve api
          const nameMap = await getTypeNames(typeIDs);

          // Attach respective type name to the item
          for (let i = 0; i < items.length; i++) {
            var pair;

            for (pair of nameMap) {

              if (items[i].typeID === pair.id) {

                items[i].typeName = pair.name;
                break;
              }
            }
          }

          contractItemCache.set(id, items);
        }

        fetchTaskCache.delete(id);

        return { itemList: items };
    });

    fetchTaskCache.set(id, newFetchTask);

    return newFetchTask;
  },
};

export default contractItems;
