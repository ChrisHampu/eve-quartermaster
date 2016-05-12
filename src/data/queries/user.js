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
import verifySession from '../../core/verifySession';

const user = {
  type: UserType,
  resolve(_, __, session) {

    return verifySession(session);
  }
};

export default user;
