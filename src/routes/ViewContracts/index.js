/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import Promise from 'bluebird';
import React from 'react';
import ViewContracts from './ViewContracts';
import fetch from '../../core/fetch';
import { parseString } from 'xml2js';
import fetchXML from '../../core/fetchXML';

let parseXml = Promise.promisify(parseString);

export const path = '/';
export const action = async (state) => {

	//const xml = await new fetchXML('https://api.eveonline.com/account/APIKeyInfo.xml.aspx', { keyID: '5197942', vCode: 'WvBjs4uiUkWfKuLPK9QV9xbJ8Fnso9bSwBRnbmoARUN1fzE3PfPc1k83PHAERRm1'}).getXML();

	//xml.then(xml => {
	//	console.log(xml.eveapi.result[0].key[0].rowset);
	//});
	

	
	//const response = await fetch('/graphql?query={news{title,link,contentSnippet}}');
	//const { data } = await response.json();
	state.context.onSetTitle('57th Eve Contracts');
	return <ViewContracts/>;
};