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

import jwt from 'jsonwebtoken';
import fetch from './fetch';
import { fetchCharacter } from '../data/queries/character.js'; // eslint-disable-line no-unused-vars
import { auth, eve } from '../config'; // eslint-disable-line no-unused-vars

async function verifySession(session) {

  let user = {};

  try {

    user = jwt.verify(session.jwt, auth.jwt.secret);

    if (Date.now() > Date.parse(user.expires)) {

      const authorization = `${auth.eve.id}:${auth.eve.secret}`;
      const payload = { grant_type: 'refresh_token', refresh_token: user.refresh_token };

      const resp = await fetch(`https://login.eveonline.com/oauth/token`,
        { headers: { 'Content-Type': 'application/json', Authorization: `Basic ${new Buffer(authorization).toString('base64')}` }, method: 'POST', payload: JSON.stringify(payload) });

      const text = await resp.json();

      user.access_token = text.access_token;
      user.expires = new Date(Date.now() + text.expires_in * 1000).toUTCString();

      session.jwt = jwt.sign(user, auth.jwt.secret); // eslint-disable-line no-param-reassign
      session.save();
    }

    try {

      const res = await fetchCharacter(user.id);

      if (eve.corp_only === 'true') {
        if (res.corporation.id !== eve.corp_id) {
          console.log(`Session verification error: User corporation (${res.corporation.id} is incorrect (${eve.corp_id}`);
          return { authenticated: false };
        }
      } else {
        if (res.alliance !== eve.alliance_id) {
          console.log(`Session verification error: User alliance (${res.alliance} is incorrect (${eve.alliance_id}`);
          return { authenticated: false };
        }
      }
    } catch (err) {
      console.log(`Session verification error: ${err}`);
      return { authenticated: false };
    }

  } catch (err) {
    console.log(`Session verification error: ${err}`);
    return { authenticated: false };
  }

  return { authenticated: true, access_token: user.access_token, alliance: user.alliance, corp_id: user.corp_id, corp_name: user.corp_name, id: user.id, name: user.name };
}

export default verifySession;
