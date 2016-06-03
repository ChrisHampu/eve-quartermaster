/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import {
  GraphQLSchema as Schema,
  GraphQLObjectType as ObjectType,
} from 'graphql';

import alliances from './queries/alliances';
import character from './queries/character';
import contracts from './queries/contracts';
import user from './queries/user';
import contractItems from './queries/contract_items';
import createRequest from './queries/create_request';
import deleteRequest from './queries/delete_request';
import requests from './queries/requests';
import notifications from './queries/notifications';
import viewNotification from './queries/view_notification';

const schema = new Schema({
  query: new ObjectType({
    name: 'Query',
    fields: {
      alliances,
      character,
      contracts,
      user,
      contractItems,
      createRequest,
      deleteRequest,
      requests,
      notifications,
      viewNotification
    },
  }),
});

export default schema;
