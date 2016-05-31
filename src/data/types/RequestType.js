/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import {
  GraphQLObjectType as ObjectType,
  GraphQLInt as IntType,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
  GraphQLFloat as FloatType,
  GraphQLList as List
} from 'graphql';

const RequestItemType = new ObjectType({
  name: 'RequestItemOutput',
  fields: {
    count: { type: new NonNull(IntType) },
    name: { type: new NonNull(StringType) }
  },
});

const RequestType = new ObjectType({
  name: 'RequestType',
  fields: {
    title: { type: new NonNull(StringType) },
    status: { type: new NonNull(StringType) },
    character_name: { type: new NonNull(StringType) },
    contract_count: { type: new NonNull(IntType) },
    items: { type: new NonNull(new List(RequestItemType)) },
    station: { type: new NonNull(StringType) },
    expires: { type: FloatType },
  },
});

export default RequestType;
