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
} from 'graphql';

const CorporationType = new ObjectType({
  name: 'Corporation',
  fields: {
    id: { type: new NonNull(IntType) },
    name: { type: StringType, defaultValue: '' }
  },
});

export default CorporationType;
