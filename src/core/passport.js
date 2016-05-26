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

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser(async (obj, done) => {

  db.connect(async ({ query }) => {

   const result = await query(
      `SELECT character_id, character_name, corp_id, corp_name, alliance_id, token_expire FROM login WHERE character_id = $1 LIMIT 1`, // eslint-disable-line quotes
      obj.id
    );

    if (!result.rowCount) {
      done(null, false, { message: 'Unknown EVE account given' });
      return;
    }

    if (result.rows[0].character_id !== obj.id) {
        done(null, false, { message: 'Failed to verify given user id' });
        return;
    }

    const response = await fetch(`/graphql?query={character(id:${obj.id}){id,name,corporation{id,name},alliance}}`); // eslint-disable-line quotes
    const { data } = await response.json();

    if (data.character.id === null || data.character.id !== charInfo.CharacterID) {

      done(null, false, { message: 'Failed to verify given user id' });
      return;
    }

    // Update potentially out-of-date info
    if (result.rows[0].corp_id !== data.character.corporation.id) {

      await query(`
      UPDATE login SET corp_id = $1, corp_name = $2, alliance_id = $3 WHERE character_id = $4`,
        data.character.corporation.id, data.character.corporation.name, data.character.alliance, data.character.id);
    }

    if (eve.corp_only === 'true') {
      if (data.character.corporation.id.toString() !== eve.corp_id) {
        done(null, false, { message: 'Your corporation does not have access to this page' });
        return;
      }
    } else {
      if (data.character.alliance.toString() !== eve.alliance_id) {
        done(null, false, { message: 'Your corporation or alliance does not have access to this page' });
        return;
      }
    }

    const user = {};

    user.id = data.character.id;
    user.corp_id = data.character.corporation !== null ? data.character.corporation.id : '0';
    user.corp_name = data.character.corporation !== null ? data.character.corporation.name : '';
    user.alliance = data.character.alliance;
    user.name = data.character.name;
    user.expires = obj.expires;

    console.log("deserialized");
    console.log(user);

    done(null, user);

  }).catch(done);

});

passport.use(new EveOnlineStrategy({
  clientID: config.eve.id,
  clientSecret: config.eve.secret,
  callbackURL: config.eve.callback
}, (charInfo, done) => {

  db.connect(async ({ query }) => {

    const result = await query(
        `SELECT character_id, character_name, corp_id, corp_name, alliance_id, token_expire FROM login WHERE character_id = $1`,
        charInfo.CharacterID
    );

    if (result.rowCount) {

      const user = {};

      const response = await fetch(`/graphql?query={character(id:${charInfo.CharacterID}){id,name,corporation{id,name},alliance}}`);
      const { data } = await response.json();

      if (data.character.id === null || data.character.id !== charInfo.CharacterID) {

        done(null, false, { message: 'Failed to verify given user id' });
        return;
      }

      // Update potentially out-of-date info
      if (data.character.corporation && result.rows[0].corp_id !== data.character.corporation.id) {

        await query(`
        UPDATE login SET corp_id = $1, corp_name = $2, alliance_id = $3, token_expire = $4 WHERE character_id = $5`,
          data.character.corporation.id, data.character.corporation.name, data.character.alliance, charInfo.ExpiresOn, data.character.id);
      }

      if (eve.corp_only === 'true') {
        if (data.character.corporation.id.toString() !== eve.corp_id) {
          done(null, false, { message: 'Your corporation does not have access to this page' });
          return;
        }
      } else {
        if (data.character.alliance.toString() !== eve.alliance_id) {
          done(null, false, { message: 'Your corporation or alliance does not have access to this page' });
          return;
        }
      }

      user.id = data.character.id;
      user.corp_id = data.character.corporation !== null ? data.character.corporation.id : '0';
      user.corp_name = data.character.corporation !== null ? data.character.corporation.name : '';
      user.alliance = data.character.alliance;
      user.name = data.character.name;
      user.expires = charInfo.ExpiresOn;

      // TODO: Verify token?

      console.log("User authorized");
      console.log(user);

      done(null, user);
    } else {

      const response = await fetch(`/graphql?query={character(id:${charInfo.CharacterID}){id,name,corporation{id,name},alliance}}`);
      const { data } = await response.json();

      if (data.character.id === null || data.character.id !== charInfo.CharacterID) {
        done(null, false, { message: 'Failed to verify given user id' });
        return;
      }

      if (eve.corp_only === 'true') {
        if (data.character.corporation.id.toString() !== eve.corp_id) {
          done(null, false, { message: 'Your corporation does not have access to this page' });
          return;
        }
      } else {
        if (data.character.alliance.toString() !== eve.alliance_id) {
          done(null, false, { message: 'Your corporation or alliance does not have access to this page' });
          return;
        }
      }

      const user = {};

      user.id = data.character.id;
      user.corp_id = data.character.corporation !== null ? data.character.corporation.id : '0';
      user.corp_name = data.character.corporation !== null ? data.character.corporation.name : '';
      user.alliance = data.character.alliance;
      user.name = data.character.name;
      user.expires = charInfo.ExpiresOn;

      await query(`
          INSERT INTO login (character_id, character_name, corp_id, corp_name, alliance_id, token_expire) VALUES ($1,
            $2, $3, $4, $5, $6) RETURNING(id, character_id)`,
          charInfo.CharacterID, charInfo.CharacterName, data.character.corporation.id, data.character.corporation.name,
            data.character.alliance, charInfo.ExpiresOn);

      done(null, user);
    }
  }).catch(done);
}));

export default passport;
