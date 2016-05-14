/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { GraphQLList as List, GraphQLInt as IntType } from 'graphql';
import fetchXML from '../../core/fetchXML';
import ContractItemListType from '../types/ContractItemListType';
import { eve } from '../../config.js';
import verifySession from '../../core/verifySession';

const contractItemUrl = `https://api.eveonline.com/corp/ContractItems.xml.aspx?keyID=${eve.corp_key}&vCode=${eve.corp_vcode}&contractID=`;
const typeNameUrl = `https://api.eveonline.com/eve/TypeName.xml.aspx?ids=`;

let typeNameCache = new Map();
let contractItemCache = new Map(); // Contract items are basically cached permanently as they will not change
let fetchTaskCache = new Map();

// Takes an array of EVE type IDs and resolves them to type names using the EVE api
// It batches as much as possible to avoid a large number of requests to the api
// Each type name is cached after its retrieved to facilitate rate limiting
async function getTypeNames(typeIDs) {

  let names = [];
  let requests = [];

  // First check IDs against cache
  typeIDs.forEach((id) => {

    let name = typeNameCache.get(id);

    if(name) {
      names.push({id: id, name: name });
    } else {
      // If not cached, place into list that needs to be queried
      requests.push(parseInt(id)); // XML api takes the id as an integer
    }

  });

  // For remaining, create an XML request
  if(requests.length) {

    let ids = requests.join(',');

    let url = `${typeNameUrl}${ids}`;

    let resp = await new fetchXML(url).getXML();

    if(resp.xml.eveapi.error === undefined) {
      
      for(var name of resp.xml.eveapi.result[0].rowset[0].row) {

        typeNameCache.set(name.$.typeID, name.$.typeName);

        names.push({id: name.$.typeID, name: name.$.typeName});
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

    let auth = await verifySession(session);

    if(!auth.authenticated) {
      return { itemList: [] };
    }

    let result = contractItemCache.get(id);

    if(result) {
      return { itemList: result };
    }

    let fetchTask = fetchTaskCache.get(id);

    if(fetchTask) {
      return fetchTask;
    }

    let newFetchTask = new fetchXML(`${contractItemUrl}${id}`)
      .getXML()
      .then( async ({ xml }) => {

        let items = [];

        if(xml.eveapi.error === undefined) {

          let typeIDs = [];

          for (var item of xml.eveapi.result[0].rowset[0].row) {

            items.push({
              id: item.$.recordID,
              typeID: item.$.typeID,
              quantity: item.$.quantity,
              typeName: "Unknown"
            });

            typeIDs.push(item.$.typeID);
          }

          // Retrieve a mapping of type id -> type name using local cache + eve api
          let nameMap = await getTypeNames(typeIDs);

          // Attach respective type name to the item
          for(var i = 0; i < items.length; i++) {

            for(var pair of nameMap) {

              if(items[i].typeID === pair.id) {

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
