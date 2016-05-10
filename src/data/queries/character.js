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

let characterCache = new Map();

export function fetchCharacter(id) {

  let result = characterCache.get(id);

  if(result) {

    if(result.expires && Date.now() < result.expires) {
      return result.data;
    }
  }

  result = new fetchXML(url, { characterID: id })
  .getXML()
  .then( ( { xml } ) => {

    if(xml.eveapi.error !== undefined) {
      return null; 
    }

    let res = xml.eveapi.result[0];
    let data = { id: res.characterID, name: res.characterName, corporation: { id: res.corporationID, name: res.corporation }, alliance: res.allianceID };

    let cache = { expires: Date.parse(xml.eveapi.cachedUntil[0] + " UTC"), data: data };

    characterCache.set(id, cache);

    return data;
  });

  return result;
};

const character = {
  type: CharacterType,
  args: {
    id: { type: IntType }
  },
  resolve(session, { id }) {

    return fetchCharacter(id);    
  },
};

export default character;
