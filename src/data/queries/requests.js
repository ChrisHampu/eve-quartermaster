
import {
  GraphQLList as List
} from 'graphql';

import db from '../../core/db';
import verifySession from '../../core/verifySession';
import { stationIDToName } from '../../constants/stationIDToName';

import RequestType from '../types/RequestType';

// Update the status of a request by ID to 'newStatus'
export async function fulfillRequest(id, newStatus) {

  db.connect(async ({ query }) => {

    query(
      `UPDATE requests SET status = $1 WHERE id = $2`,
      newStatus, id
    );

  }).catch(() => {
  });
}

export async function getAllRequests() {

 const requests = [];

  const error = await db.connect(async ({ query }) => {

    const result = await query(
      `SELECT requests.id, title, status, corp_only, contract_count, character_name, location as station, (date_part('epoch', expires)*1000)::bigint as expires FROM requests LEFT JOIN login ON (requests.character_id = login.character_id) WHERE expires > now() - interval '14 day'`
    );

    if (!result.rowCount) {
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

  }).catch(() => {

    return [];
  });

  if (error) {
    return error;
  }

  return requests;
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

    return getAllRequests();
  },
};

export default getRequests;
