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
  GraphQLID as ID,
  GraphQLInt as IntType,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
  GraphQLList as List,
  GraphQLBoolean as BooleanType,
} from 'graphql';

const UserType = new ObjectType({
  name: 'User',
  fields: {
    authenticated: { type: new NonNull(BooleanType) },
    id: { type: IntType },
    name: { type: StringType },
    corp_id: { type: IntType },
    corp_name: { type: StringType },
    alliance: { type: IntType }
  },
});

export default UserType;
