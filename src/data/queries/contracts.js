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
import ContractListType from '../types/ContractListType';
import { eve } from '../../config.js';
import { stationIDToName } from '../../constants/stationIDToName';
import verifySession from '../../core/verifySession';
import { getAllRequests, fulfillRequest } from './requests.js';
import { getContractItems } from './contract_items.js';

const url = `https://api.eveonline.com/corp/Contracts.xml.aspx?keyID=${eve.corp_key}&vCode=${eve.corp_vcode}`;

let contractList = [];
let lastFetchTask;
let nextFetch = new Date(Date.now());
let fulfillmentTask = null;
let autoFetchTimer = null;

// After each new contract pull from the API, this function will run async
// and check if the contracts fulfill any requests
async function checkFulfilledRequests(contracts) {

	console.log("Beginning task to check for request fulfillment.");
	console.time('request_fulfillment');

	const requests = await getAllRequests();

	// Filter out fulfilled requests. TODO: getAllRequests() should instead filter at the SQL query level
	requests.filter((request) => {
		return request.status !== 'full';
	});

	for (const contract of contracts) {

		try {

			// Make sure its an item exchange contract
			if (contract.type !== 0) {
				continue;
			}

			let items = [];

			try {
				// Pull contract items from EVE API
				const res = await getContractItems(contract.id);
				items = res.itemList;

			} catch (err) {
				items = [];
			}

			for (const request of requests) {

				// Check if this request hasn't been already fulfilled
				if (request.status === 'full') {
					continue;
				}

				// Must be at same location
				if (stationIDToName[contract.startStationID] !== request.station) {
					continue;
				}

				// Need to first properly group together request items
				// There could be duplicate name entries with different amounts
				const requestItems = [];

				for (const item of request.items) {

					const idx = requestItems.findIndex((it) => {
						return item.name === it.typeName;
					});

					if (idx === -1) {
						requestItems.push({ name: item.name, count: item.count });
					} else {
						requestItems[idx].count += item.count;
					}
				}

				let matched = 0;

				// Now loop through request + contract items together
				for (const item of requestItems) {

					// Check for name match
					const idx = items.findIndex((it) => {
						return item.name === it.typeName;
					});

					if (idx === -1) {
						break;
					}

					// Check if same number if items in request & contract
					if (parseInt(items[idx].quantity) !== item.count) {
						break;
					}

					matched++;
				}

				// Make sure the same amount of items are in the request & contract
				if (matched === items.length && matched === request.items.length) {

					// TODO: Remove when no longer needed as testing output
					console.log(`Fulfilled request "${request.title}" with ID ${request.id}`);

					// TODO: There is currently no support for partial fulfillment or fulfilling requests for multiple contracts
					// For tracking in this loop (making sure not fulfilled more than once)
					request.status = 'full';

					// Query database to update contract status
					fulfillRequest(request, 'full');
				}
			}
		} catch (err) {
			console.log("Error while fulfilling request:");
			console.log(err);
		}
	}

	fulfillmentTask = null;

	console.log("Finished request fulfillment check. Time taken:");
	console.timeEnd('request_fulfillment');
}

async function getAllContracts() {

	if ((new Date(Date.now())) < nextFetch) {
		return { contractList: contractList };
	}

	console.log("Beginning task to fetch contracts.");
	console.time('fetch_contracts');

	lastFetchTask = new fetchXML(url) // eslint-disable-line new-cap
	.getXML()
	.then(({ xml }) => {

		contractList = [];

		if (xml.eveapi.error === undefined) {
			let contract; // eslint-disable-line vars-on-top

			for (contract of xml.eveapi.result[0].rowset[0].row) {

				const c = contract.$;

				contractList.push({
					id: c.contractID,
					issuerID: c.issuerID,
					issuerCorpID: c.issuerCorpID,
					assigneeID: c.assigneeID,
					acceptorID: c.acceptorID,
					stationName: stationIDToName[c.startStationID],
					startStationID: c.startStationID,
					endStationID: c.endStationID,
					type: eve.contractType[c.type],
					status: eve.contractStatus[c.status],
					title: c.title,
					forCorp: c.forCorp,
					public: c.availability === 'Public' ? 1 : 0,
					dateIssued: c.dateIssued,
					dateExpired: c.dateExpired,
					dateAccepted: c.dateAccepted,
					numDays: c.numDays,
					dateCompleted: c.dateCompleted,
					price: c.price,
					reward: c.reward,
					collateral: c.collateral,
					buyout: c.buyout,
					volume: c.volume
				});
			}
		}

		nextFetch = new Date(Date.parse(xml.eveapi.cachedUntil));

		lastFetchTask = null;

		if (autoFetchTimer) {
			clearTimeout(autoFetchTimer);
		}

		// Schedule an auto fetch. This is to keep contracts up-to-date as much as possible in memory,
		// rather than being loaded on-demand when user opens the page.
		autoFetchTimer = setTimeout(getAllContracts, nextFetch.getTime() - Date.now() + 1000);

		console.log("Finished fetching contracts. Time taken:");
		console.timeEnd('fetch_contracts');
		console.log(`${contractList.length} contracts loaded`);

		// This function will run asynchronously as needed
		// Tracking is used to ensure the function doesn't overlap
		if (!fulfillmentTask) {
			fulfillmentTask = checkFulfilledRequests(contractList);
		}

		return { contractList: contractList };
	});

	if (contractList.length) {
		return { contractList: contractList };
	}

	return lastFetchTask;
}

const contracts = {

	type: ContractListType,
	async resolve(_, __, session) {

		const auth = await verifySession(session);

		if (!auth.authenticated) {
			console.log("Error loading contracts: User not authenticated.");
			return { contractList: [] };
		}

		if (lastFetchTask) {
			return lastFetchTask;
		}

		return getAllContracts();
	},
};

export default contracts;
