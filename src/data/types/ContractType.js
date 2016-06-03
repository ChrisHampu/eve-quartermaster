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
  GraphQLObjectType as ObjectType,
  GraphQLInt as IntType,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
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
