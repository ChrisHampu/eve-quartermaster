
import {
  GraphQLList as List
} from 'graphql';

import db from '../../core/db';
import verifySession from '../../core/verifySession';

import RequestType from '../types/RequestType';

const getRequests = {
  type: new List(RequestType),
  args: {
  },
  async resolve(_, args, session) {

    const auth = await verifySession(session);

    if (!auth.authenticated) {
      return { success: 0, message: 'Failed to authenticate. Make sure you are logged in and have the correct permissions.' };
    }

    const requests = [];

    const error = await db.connect(async ({ query }) => {

      const result = await query(
        `SELECT requests.id, title, status, corp_only, contract_count, character_name FROM requests LEFT JOIN login ON (requests.character_id = login.character_id)`
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

        requests.push(res);
      }

    }).catch(() => {

      return [];
    });

    if (error) {
      return error;
    }

    return requests;
  },
};

export default getRequests;
