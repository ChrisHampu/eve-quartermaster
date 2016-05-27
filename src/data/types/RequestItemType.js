/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import {
  GraphQLInputObjectType as ObjectType,
  GraphQLInt as IntType,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
} from 'graphql';

const RequestItemType = new ObjectType({
  name: 'RequestItem',
  fields: {
    count: { type: new NonNull(IntType) },
    name: { type: new NonNull(StringType) }
  },
});

export default RequestItemType;
