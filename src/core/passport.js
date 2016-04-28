/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import passport from 'passport';
import EveOnlineStrategy from 'passport-eveonline';
import db from './db';
import { auth as config } from '../config';

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  console.log("Deserializing");
  console.log(obj);
  done(null, obj);
});

passport.use(new EveOnlineStrategy({
  clientID: config.eve.id,
  clientSecret: config.eve.secret,
  callbackURL: config.eve.callback
}, (charInfo, done) => {

  console.log(charInfo);

  db.connect(async ({ query }) => {

    let result = await query(
        'SELECT id, character_id FROM login WHERE character_id = $1',
        charInfo.CharacterID
    );

    if (result.rowCount) {
        
        // TODO: Verify token?
        // TODO: Get current corp and verify it?

        done(null, result.rows[0]);
    } else {

      await query(`
          INSERT INTO login (character_id, character_name, corp_id, token_expire) VALUES ($1,
            $2, $3, $4) RETURNING(id, character_id)`,
          charInfo.CharacterID, charInfo.CharacterName, 0, charInfo.ExpiresOn);

      console.log("Inserting new user " + charInfo.CharacterName);

      done(null, result.rows[0]);
    }
  }).catch(done);
}));

export default passport;
