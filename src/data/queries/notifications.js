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

    return getAllNoficiations(auth.id);
  },
};

export default getNotifications;
