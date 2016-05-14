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

const ContractItemType = new ObjectType({
  name: 'ContractItem',
  fields: {
    id: { type: new NonNull(IntType) },
    quantity: { type: new NonNull(IntType) },
    typeID: { type: new NonNull(IntType) },
    typeName: { type: new NonNull(StringType) }
  },
});

export default ContractItemType;
