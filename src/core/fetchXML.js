import Promise from 'bluebird';
import fetch from './fetch';
import { parseString } from 'xml2js';

let parseXml = Promise.promisify(parseString);

class fetchXML {

	constructor(url, options) {
		
		if(url === undefined) {
			throw "No url supplied";
		}

		var query = url;

		if(options !== undefined && typeof options === "object") {

			query += "?";
		
			for (var prop in options) {

				query += prop + "=" + options[prop] + "&";
			}
		}

		this.url = query;
	}

	async getXML()  {
		const response = await fetch(this.url);
		const body = await response.text();
		const xml = await parseXml(body);

		return new Promise((resolve, reject) => {
			
			return resolve({
				xml: xml
			})
		});
	}
}


export default fetchXML;