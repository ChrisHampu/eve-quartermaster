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

import React from 'react';
import ViewContracts from './ViewContracts';
import fetch, { fetchLocal } from '../../core/fetch';

export const path = '/';
export const action = async (state) => {

  let data = null;

  if (fetchLocal === undefined) {
    const response = await fetch(`/graphql?query={contracts{contractList{id,issuerID,issuerCorpID,assigneeID,stationName,startStationID,endStationID,type,status,
                             title,forCorp,public,dateIssued,dateExpired,dateAccepted,numDays,dateCompleted,price,reward,collateral,buyout,volume}}}`,
                             { credentials: 'same-origin' });

    const json = await response.json();

    data = json.data;

  } else {
    const json = await fetchLocal(`/graphql?query={contracts{contractList{id,issuerID,issuerCorpID,assigneeID,stationName,startStationID,endStationID,type,status,
                               title,forCorp,public,dateIssued,dateExpired,dateAccepted,numDays,dateCompleted,price,reward,collateral,buyout,volume}}}`,
                               { cookies: [state.context.getSession()] });

    data = json.data;
  }

  let contractList = [];

  if (data && data.contracts) {
    contractList = data.contracts.contractList || [];
  }

  state.context.onSetTitle('57th Eve Contracts');
  return <ViewContracts contracts={contractList} />;
};
