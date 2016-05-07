/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { GraphQLList as List } from 'graphql';
import fetchXML from '../../core/fetchXML';
import AllianceListType from '../types/AllianceListType';

const url = 'https://api.eveonline.com/eve/AllianceList.xml.aspx';

let allianceList = [];
let lastFetchTask;
let lastFetchTime = new Date(1970, 0, 1);

const alliances = {
  type: AllianceListType,
  resolve() {
    if (lastFetchTask) {
      return lastFetchTask;
    }

    if ((new Date() - lastFetchTime) > 1000 * 3 /* 10 mins */) {
      lastFetchTime = new Date();
      lastFetchTask = fetchXML(url)
        .then(xml => {
          if (data.responseStatus === 200) {
            //allianceList = data.responseData.feed.entries;

            console.log(xml);
          }

          return allianceList;
        })
        .finally(() => {
          lastFetchTask = null;
        });

      if (allianceList.length) {
        return allianceList;
      }

      return lastFetchTask;
    }

    return allianceList;
  },
};

export default alliances;
