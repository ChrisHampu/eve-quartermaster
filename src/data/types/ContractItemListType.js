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
  GraphQLNonNull as NonNull,
  GraphQLList as List
} from 'graphql';

import ContractItemType from './ContractItemType';

const ContractItemListType = new ObjectType({
  name: 'ContractItemList',
  fields: {
    itemList: { type: new NonNull(new List(ContractItemType)) }
  },
});

export default ContractItemListType;
