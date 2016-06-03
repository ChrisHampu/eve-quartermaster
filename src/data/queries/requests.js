
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

    const message = `Your request titled ${request.title} was fulfilled`;

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
