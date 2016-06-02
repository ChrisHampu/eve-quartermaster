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
  GraphQLString as StringType,
  GraphQLBoolean as BooleanType,
  GraphQLInt as IntType,
  GraphQLFloat as FloatType,
  GraphQLNonNull as NonNull,
} from 'graphql';

const NotificationType = new ObjectType({
  name: 'Notification',
  fields: {
    text: { type: new NonNull(StringType) },
    viewed: { type: new NonNull(BooleanType) },
    id: { type: new NonNull(IntType) },
    time: { type: new NonNull(FloatType) }
  },
});

export default NotificationType;
