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

import fetch from '../../core/fetch';
import verifySession from '../../core/verifySession';

const openContract = {
  type: BooleanType,
  args: {
    id: { type: new NonNull(IntType) }
  },
  async resolve(_, { id }, session) {

    const auth = await verifySession(session);

    if (!auth.authenticated) {
      return false;
    }

    console.log("test");

    try {

      const payload = { contractID: id };

      const resp = await fetch(`https://crest-tq.eveonline.com/characters/${auth.id}/ui/openwindow/contract/`,
        { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.access_token}` }, method: 'POST', payload: JSON.stringify(payload) });

      if (resp.body.length === 0) {

        console.log("true");
        return true;
      }

      const text = await resp.json();

      console.log(text);

      console.log("test2");

      if (text.exceptionType) {
        console.log(text.message);
        return false;
      }
    } catch (e) {

      console.log(e);
      return false;
    }

    console.log("test3");

    return true;
  }
};

export default openContract;
