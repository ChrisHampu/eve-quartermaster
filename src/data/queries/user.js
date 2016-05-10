/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { GraphQLList as List, GraphQLInt as IntType } from 'graphql';
import UserType from '../types/UserType';
import Promise from 'bluebird';
import jwt from 'jsonwebtoken';
import { auth, eve } from '../../config';
import fetchCharacter from './character.js';

const user = {
  type: UserType,
  async resolve(_, { id }, session) {

    console.log(session);

    let user = {};

    return { authenticated: true, user };

    try {
      user = jwt.verify(session.jwt, auth.jwt.secret);

      console.log("verifying");

      let res = await fetchCharacter(user.id);

      console.log(res);

      if(res.alliance !== eve.alliance_id) {
        return { authenticated: false };
      }

    } catch (err) {
      return { authenticated: false };
    }

    return { authenticated: true, user };    
  }
};

export default user;
