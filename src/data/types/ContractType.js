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
  GraphQLEnumType as EnumType,
  GraphQLFloat as FloatType
} from 'graphql';

const typeEnum = new EnumType({
  name: 'ContractType',
  description: '',
  values: {
    ItemExchange: {
      value: 0,
      description: '',
    },
    Courier: {
      value: 1,
      description: '',
    },
    Loan: {
      value: 2,
      description: '',
    },
    Auction: {
      value: 3,
      description: '',
    }
  }
});

const statusEnum = new EnumType({
  name: 'ContractStatus',
  description: '',
  values: {
    Outstanding: {
      value: 0,
      description: '',
    },
    Deleted: {
      value: 1,
      description: '',
    },
    Completed: {
      value: 2,
      description: '',
    },
    Failed: {
      value: 3,
      description: '',
    },
    CompletedByIssuer: {
      value: 4,
      description: '',
    },
    CompletedByContractor: {
      value: 5,
      description: '',
    },
    Cancelled: {
      value: 6,
      description: '',
    },
    Rejected: {
      value: 7,
      description: '',
    },
    Reversed: {
      value: 8,
      description: '',
    },
    InProgress: {
      value: 9,
      description: '',
    }
  }
});

const ContractType = new ObjectType({
  name: 'Contract',
  fields: {
    id: { type: new NonNull(IntType) },
    issuerID: { type: new NonNull(IntType) },
    issuerCorpID: { type: new NonNull(IntType) },
    assigneeID: { type: new NonNull(IntType) },
    acceptorID: { type: new NonNull(IntType) },
    stationName: { type: new NonNull(StringType) },
    startStationID: { type: new NonNull(IntType) },
    endStationID: { type: new NonNull(IntType) },
    type: { type: new NonNull(typeEnum) },
    status: { type: new NonNull(statusEnum) },
    title: { type: new NonNull(StringType) },
    forCorp: { type: new NonNull(IntType) },
    public: { type: new NonNull(IntType) }, // 1 = public, 0 = private
    dateIssued: { type: new NonNull(StringType) },
    dateExpired: { type: new NonNull(StringType) },
    dateAccepted: { type: new NonNull(StringType) },
    numDays: { type: new NonNull(IntType) },
    dateCompleted: { type: new NonNull(StringType) },
    price: { type: new NonNull(FloatType) },
    reward: { type: new NonNull(FloatType) },
    collateral: { type: new NonNull(FloatType) },
    buyout: { type: new NonNull(FloatType) },
    volume: { type: new NonNull(FloatType) },
  },
});

export default ContractType;
