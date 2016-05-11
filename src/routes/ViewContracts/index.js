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

	const response = await fetch(`/graphql?query={contracts{contractList{id,issuerID,issuerCorpID,assigneeID,stationName,startStationID,endStationID,type,status,
								 title,forCorp,public,dateIssued,dateExpired,dateAccepted,numDays,dateCompleted,price,reward,collateral,buyout,volume}}}`);
	const { data } = await response.json();

	let contractList = [];

	if(data.contracts)
		contractList = data.contracts.contractList || [];

	state.context.onSetTitle('57th Eve Contracts');
	return <ViewContracts contracts={contractList}/>;
};