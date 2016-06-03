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
  GraphQLList as List
} from 'graphql';

import db from '../../core/db';
import verifySession from '../../core/verifySession';
import { stationIDToName } from '../../constants/stationIDToName';

import RequestType from '../types/RequestType';

// TODO: Filter 'for corp' requests when sending to user

// Update the status of a request by ID to 'newStatus'
export async function fulfillRequest(request, newStatus) {

  db.connect(async ({ query }) => {

    await query(
      `UPDATE requests SET status = $1 WHERE id = $2`,
      newStatus, request.id
    );

    const message = `Your request titled '${request.title}' was fulfilled`;

    await query(
      `INSERT INTO notifications (character_id, message) VALUES ((SELECT character_id FROM requests WHERE id = $1), '${message}')`,
      request.id
    );

  }).catch((err) => {
    console.log("Error while fulfilling request:");
    console.log(err);
  });
}

export async function getAllRequests() {

  return new Promise((resolve) => {

    db.connect(async ({ query }) => {

      const requests = [];

      const result = await query(
        `SELECT requests.id, corp_id, title, status, corp_only, contract_count, character_name, location as station, (date_part('epoch', expires)*1000)::bigint as expires FROM requests LEFT JOIN login ON (requests.character_id = login.character_id) WHERE expires > now() - interval '14 day'`
      );

      if (!result.rowCount) {
        resolve([]);
        return;
      }

      for (const row of result.rows) {

        const itemResult = await query(
          `SELECT item_name as name, item_count as count FROM request_items WHERE request_id = $1`,
          row.id
        );

        const res = row;

        res.items = itemResult.rows;
        res.station = res.station !== null ? stationIDToName[res.station] : "Unknown";
        res.expires = parseFloat(res.expires);

        requests.push(res);
      }

      resolve(requests);

    }).catch((err) => {

      console.log("Database error while querying for requests:");
      console.log(err);

      resolve([]);
    });
  });
}

const getRequests = {
  type: new List(RequestType),
  args: {
  },
  async resolve(_, args, session) {

    const auth = await verifySession(session);

    if (!auth.authenticated) {
      return { success: 0, message: 'Failed to authenticate. Make sure you are logged in and have the correct permissions.' };
    }

    const requests = await getAllRequests();

    return requests.filter((request) => {

      if (!request.corp_only) {
        return true;
      }

      return request.corp_id === auth.corp_id;
    });
  },
};

export default getRequests;
