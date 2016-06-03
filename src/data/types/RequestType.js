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
    expires: { type: new NonNull(FloatType) },
    id: { type: new NonNull(IntType) },
  },
});

export default RequestType;
