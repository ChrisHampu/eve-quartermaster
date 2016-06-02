import {
  GraphQLList as List
} from 'graphql';

import db from '../../core/db';
import verifySession from '../../core/verifySession';

import NotificationType from '../types/NotificationType';

async function sendNotification(charID, message) { // eslint-disable-line no-unused-vars

  if (!charID || !message) {
    return;
  }

  db.connect(({ query }) => {

    query(
      `INSERT INTO notifications (character_id, message) VALUES ($1, $2)`,
      charID, message
    );

  }).catch((err) => {
    console.log(err);
  });
}

async function getAllNoficiations(id) {

  return new Promise((resolve) => {

    db.connect(async ({ query }) => {

      // Notifications will show up as viewed first, and newest first
      const result = await query(
        `SELECT id, viewed, message as text, (date_part('epoch', time)*1000)::bigint as time FROM notifications WHERE character_id = $1 ORDER BY viewed ASC, time DESC LIMIT 5`,
        id
      );

      if (!result.rowCount) {
        resolve([]);
        return;
      }

      resolve(result.rows);

    }).catch((err) => {

      console.log(err);

      resolve([]);
    });
  });
}

const getNotifications = {
  type: new List(NotificationType),
  args: {
  },
  async resolve(_, __, session) {

    const auth = await verifySession(session);

    if (!auth.authenticated) {
      return [];
    }

    console.log(auth);

    return getAllNoficiations(auth.id);
  },
};

export default getNotifications;
