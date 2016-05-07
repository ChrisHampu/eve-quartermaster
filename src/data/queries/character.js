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
import CharacterType from '../types/CharacterType';

const url = 'https://api.eveonline.com/eve/CharacterInfo.xml.aspx';

//let allianceList = [];
//let lastFetchTask;
//let lastFetchTime = new Date(1970, 0, 1);

const character = {
  type: CharacterType,
  args: {
    id: { type: IntType }
  },
  resolve(session, { id }) {

    //console.log(session);

    var result = new fetchXML(url, { characterID: id })
    .getXML()
    .then( ( { xml } ) => {

      if(xml.eveapi.error !== undefined) {
        return null;
      }

      var res = xml.eveapi.result[0];

      //if (data.responseStatus === 200) {
      //  //allianceList = data.responseData.feed.entries;

       //console.log(xml.eveapi.result[0]);
      //}

      return { id: res.characterID, name: res.characterName, corporation: { id: res.corporationID, name: res.corporation }, alliance: res.allianceID };
    });

    return result;
  },
};

export default character;
