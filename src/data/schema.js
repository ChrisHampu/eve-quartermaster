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
import contractUI from './queries/contract_ui';

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
      viewNotification,
      contractUI
    },
  }),
});

export default schema;
