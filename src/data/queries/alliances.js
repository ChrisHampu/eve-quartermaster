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

      lastFetchTask = new fetchXML(url)
      .getXML()
      .then( ({ xml }) => {

        allianceList = [];

        for(var alliance of xml.eveapi.result[0].rowset[0].row) {
          //console.log(alliance.rowset[0].row[0]);

          var corps = [];

          for(var corp of alliance.rowset[0].row) {
            corps.push({ id: corp.$.corporationID, name: ''});
          }

          allianceList.push( { id: alliance.$.allianceID, name: alliance.$.name, corps: corps });
        }

        //console.log(xml.eveapi.result[0].rowset[0].row[0].$);

        lastFetchTask = null;

        return { alliances: allianceList };
      });

      if (allianceList.length) {
        return { alliances: allianceList };
      }

      return lastFetchTask;
    }

    return { alliances: allianceList };
  },
};

export default alliances;
