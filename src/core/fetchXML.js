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

import Promise from 'bluebird';
import fetch from './fetch';
import { parseString } from 'xml2js';

const parseXml = Promise.promisify(parseString);

class fetchXML {

  constructor(url, options) {

    if (url === undefined) {
      throw 'No url supplied'; // eslint-disable-line no-throw-literal
    }

    var query = url;

    if (options !== undefined && typeof options === "object") {

      query += "?";

      for (var prop in options) { // eslint-disable-line guard-for-in

        query += prop + "=" + options[prop] + "&"; // eslint-disable-line prefer-template
      }
    }

    this.url = query;
  }

  async getXML() {
    const response = await fetch(this.url);
    const body = await response.text();
    const xml = await parseXml(body);

    return new Promise((resolve) => {

      return resolve({
        xml: xml
      });
    });
  }
}

export default fetchXML;
