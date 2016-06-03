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
  GraphQLNonNull as NonNull,
  GraphQLBoolean as BooleanType,
} from 'graphql';

import db from '../../core/db';
import verifySession from '../../core/verifySession';

const setNoficiationViewed = {
  type: BooleanType,
  args: {
    id: { type: new NonNull(IntType) }
  },
  async resolve(_, { id }, session) {

    const auth = await verifySession(session);

    if (!auth.authenticated) {
      return false;
    }

    return new Promise((resolve) => {

      db.connect(async ({ query }) => {

        // Notifications will show up as viewed first, and newest first
        await query(
          `UPDATE notifications SET viewed = true WHERE id = $1 AND character_id = $2`,
          id, auth.id
        );

        resolve(true);

      }).catch((err) => {

        console.log("Error while updating notification:");
        console.log(err);

        resolve(true);
      });
    });
  },
};

export default setNoficiationViewed;
