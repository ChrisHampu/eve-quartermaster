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
