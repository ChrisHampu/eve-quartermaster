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

import {
  GraphQLInt as IntType,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
  GraphQLBoolean as BooleanType,
  GraphQLList as List
} from 'graphql';

import db from '../../core/db';
import verifySession from '../../core/verifySession';
import { itemNames } from '../../constants/itemNames';
import { stationNameToID } from '../../constants/stationNameToID';

import CreateRequestResultType from '../types/CreateRequestResultType';
import RequestItemType from '../types/RequestItemType';

const TitleMinLength = 4; // Min length of request title
const TitleMaxLength = 60; // Max length of request title
const ContractMaxCount = 20; // Maximum number of contracts that this request can represent
const ContractItemsMaxCount = 50; // Maximum number of an item that can be in a request
const ItemMaxCount = 1000000; // Maximum number of each item that can be requested

const createRequest = {
  type: CreateRequestResultType,
  args: {
    title: { type: new NonNull(StringType) },
    station: { type: new NonNull(StringType) },
    count: { type: new NonNull(IntType) },
    corp_only: { type: new NonNull(BooleanType) },
    items: { type: new NonNull(new List(RequestItemType)) }
  },
  async resolve(_, args, session) {

    // Validate user
    const auth = await verifySession(session);

    if (!auth.authenticated) {
      return { success: 0, message: 'Failed to authenticate. Make sure you are logged in and have the correct permissions.' };
    }

    // Validate title
    if (args.title.length < TitleMinLength || args.title.length > TitleMaxLength) {
      return { success: 0, message: `Contract title must be at least ${TitleMinLength} characters and less than ${TitleMaxLength} characters in length.` };
    }

    // Validate station
    if (args.station.length < 0 || stationNameToID[args.station] === undefined) {
      return { success: 0, message: `Invalid station for this contract request.` };
    }

    // Validate contract count
    if (args.count < 1 || args.count > ContractMaxCount) {
      return { success: 0, message: `Number of requested contracts must be at least 1 and less than ${ContractMaxCount}.` };
    }

    // Validate items
    if (args.items.length <= 0 || args.items.length > ContractItemsMaxCount) {
      return { success: 0, message: `Number of items in a request must be at least one and less than ${ContractItemsMaxCount}.` };
    }

    for (const item of args.items) {

      // Item name must exist (case sensitive) in the static item list
      if (itemNames.indexOf(item.name) === -1) {
        return { success: 0, message: `Item '${item.name}' does not exist in valid item list.` };
      }
      if (item.count < 1 || item.count > ItemMaxCount) {
        return { success: 0, message: `The Number of '${item.name}' in the request must be greater than 1 and less than ${ItemMaxCount}.` };
      }
    }

    const error = await db.connect(async ({ query }) => {

      const result = await query(
        `INSERT INTO requests (title, corp_only, character_id, contract_count, location, expires) VALUES ($1, $2, $3, $4, $5, NOW() + interval '14 day') RETURNING id`,
        args.title, args.corp_only ? 'TRUE' : 'FALSE', auth.id, args.count, stationNameToID[args.station]
      );

      if (!result.rowCount) {
        return;
      }

      const requestID = result.rows[0].id;

      for (const item of args.items) {
        await query(
          `INSERT INTO request_items (request_id, item_name, item_count) values ($1, $2, $3)`,
          requestID, item.name, item.count
        );
      }

    }).catch((err) => {

      console.log(err); // eslint-disable-line no-console

      return { success: 0, message: 'There was a database error submitting your request. Refresh the page and try again or contact a Director.' };
    });

    if (error) {
      return error;
    }

    return { success: 1, message: 'Your request has been submitted.' };
  },
};

export default createRequest;
