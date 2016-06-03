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
import CharacterType from '../types/CharacterType';

const url = 'https://api.eveonline.com/eve/CharacterInfo.xml.aspx';

const characterCache = new Map();

export async function fetchCharacter(id) {

  let result = characterCache.get(id);

  if (result) {

    if (result.expires && Date.now() < result.expires) {

      return new Promise((resolve) => { return resolve(result.data); });
    }
  }

  result = new fetchXML(url, { characterID: id }) // eslint-disable-line new-cap
  .getXML()
  .then(({ xml }) => {

    if (xml.eveapi.error !== undefined) {
      return null;
    }

    const res = xml.eveapi.result[0];

    const data = { id: res.characterID[0], name: res.characterName[0], corporation: { id: res.corporationID[0], name: res.corporation[0] }, alliance: res.alliance ? res.allianceID[0] : '0' };

    const cache = { expires: Date.parse(xml.eveapi.cachedUntil[0] + " UTC"), data: data }; // eslint-disable-line prefer-template

    characterCache.set(id, cache);

    return data;
  });

  return result;
}

const character = {
  type: CharacterType,
  args: {
    id: { type: IntType }
  },
  resolve(_, { id }) {

    return fetchCharacter(id);
  },
};

export default character;
