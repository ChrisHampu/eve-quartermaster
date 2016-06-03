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
import { fetchCharacter } from '../data/queries/character.js';
import { auth, eve } from '../config';

async function verifySession(session) {

  let user = {};

  try {
    user = jwt.verify(session.jwt, auth.jwt.secret);

    try {

      const res = await fetchCharacter(user.id);

      if (eve.corp_only === 'true') {
        if (res.corporation.id !== eve.corp_id) {
          return { authenticated: false };
        }
      } else {
        if (res.alliance !== eve.alliance_id) {
          return { authenticated: false };
        }
      }
    } catch (err) {
      return { authenticated: false };
    }

  } catch (err) {
    return { authenticated: false };
  }

  return { authenticated: true, alliance: user.alliance, corp_id: user.corp_id, corp_name: user.corp_name, id: user.id, name: user.name };
}

export default verifySession;
