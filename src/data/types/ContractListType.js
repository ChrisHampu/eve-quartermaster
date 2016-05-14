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
  GraphQLList as List
} from 'graphql';

import ContractType from './ContractType';

const ContractListType = new ObjectType({
  name: 'ContractList',
  fields: {
    contractList: { type: new List(ContractType) }
  },
});

export default ContractListType;
