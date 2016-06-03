/**
 * MIT License
 * 
 * Copyright (c) 2016 The Eve Quartermaster Project, Christopher Hampu, and other contributors
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { GraphQLInt as IntType } from 'graphql';
import fetchXML from '../../core/fetchXML';
import ContractItemListType from '../types/ContractItemListType';
import { eve } from '../../config.js';
import verifySession from '../../core/verifySession';

const contractItemUrl = `https://api.eveonline.com/corp/ContractItems.xml.aspx?keyID=${eve.corp_key}&vCode=${eve.corp_vcode}&contractID=`;
const typeNameUrl = `https://api.eveonline.com/eve/TypeName.xml.aspx?ids=`; // eslint-disable-line quotes

const typeNameCache = new Map();
const contractItemCache = new Map(); // Contract items are cached permanently TODO: flush cache on a daily basis to avoid overgrowth
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

export async function getContractItems(id) {

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

    return getContractItems(id);
  },
};

export default contractItems;
