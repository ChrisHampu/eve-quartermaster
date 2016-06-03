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
import ViewRequests from './ViewRequests';
import fetch, { fetchLocal } from '../../core/fetch';

export const path = '/requests';
export const action = async (state) => {

  let data = null;

  if (fetchLocal === undefined) {
    const response = await fetch(`/graphql?query={requests{id,title,status,character_name,contract_count,expires,station,items{name,count}}}`,
                             { credentials: 'same-origin' });

    const json = await response.json();

    data = json.data;

  } else {
    const json = await fetchLocal(`/graphql?query={requests{id,title,status,character_name,contract_count,expires,station,items{name,count}}}`,
                               { cookies: [state.context.getSession()] });

    data = json.data;
  }

  let requestList = [];

  if (data && data.requests) {
    requestList = data.requests || [];
  }

  state.context.onSetTitle('57th Eve Contracts');
  return <ViewRequests requests={requestList} />;
};
