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

      lastFetchTask = new fetchXML(url) // eslint-disable-line new-cap
      .getXML()
      .then(({ xml }) => {

        allianceList = [];

        for (var alliance of xml.eveapi.result[0].rowset[0].row) { // eslint-disable-line vars-on-top no-var

          const corps = [];

          for (var corp of alliance.rowset[0].row) { // eslint-disable-line no-var vars-on-top
            corps.push({ id: corp.$.corporationID, name: '' });
          }

          allianceList.push({ id: alliance.$.allianceID, name: alliance.$.name, corps: corps });
        }

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
