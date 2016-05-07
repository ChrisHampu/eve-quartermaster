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
import { auth as config, eve } from '../config';
import fetch from './fetch';

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new EveOnlineStrategy({
  clientID: config.eve.id,
  clientSecret: config.eve.secret,
  callbackURL: config.eve.callback
}, (charInfo, done) => {

  db.connect(async ({ query }) => {

    let result = await query(
        'SELECT character_id, corp_id, alliance_id FROM login WHERE character_id = $1',
        charInfo.CharacterID
    );

    if (result.rowCount) {

      let user = {};

      const response = await fetch(`/graphql?query={character(id:${charInfo.CharacterID}){id,name,corporation{id,name},alliance}}`);
      const { data } = await response.json();

      if(data.character.corporation.id !== eve.corp_id) {
        done(null, false, { message: 'Your corporation or alliance does not have access to this page' });
        return;
      }

      user.id = data.character.id;
      user.corp_id = data.character.corporation.id;
      user.corp_name = data.character.corporation.name;
      user.alliance = data.character.alliance;
      user.name = data.character.name;

      await query(`
      REPLACE INTO login (character_id, character_name, corp_id, alliance_id, token_expire) VALUES ($1,
            $2, $3, $4)`,
          data.character.id, data.character.name, data.character.corporation.id, data.character.alliance, charInfo.ExpiresOn);

      // TODO: Verify token?
      // TODO: Get current corp and verify it?

      done(null, user);
    } else {

      const response = await fetch(`/graphql?query={character(id:${charInfo.CharacterID}){id,name,corporation{id,name},alliance}}`);
      const { data } = await response.json();

      if(data.character.id !== charInfo.CharacterID) {
        done(null, false, { message: 'Failed to verify given user id' });
        return;
      }

      if(data.character.corporation.id !== eve.corp_id) {
        done(null, false, { message: 'Your corporation or alliance does not have access to this page' });
        return;
      }

      let user = {};

      user.id = data.character.id;
      user.corp_id = data.character.corporation.id;
      user.corp_name = data.character.corporation.name;
      user.alliance = data.character.alliance;
      user.name = data.character.name;

      await query(`
          INSERT INTO login (character_id, character_name, corp_id, alliance_id, token_expire) VALUES ($1,
            $2, $3, $4) RETURNING(id, character_id)`,
          charInfo.CharacterID, charInfo.CharacterName, data.character.corporation.id, data.character.alliance, charInfo.ExpiresOn);

      console.log("Inserting new user " + charInfo.CharacterName);

      done(null, user);
    }
  }).catch(done);
}));

export default passport;
