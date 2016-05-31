/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import ViewRequests from './ViewRequests';
import fetch, { fetchLocal } from '../../core/fetch';

export const path = '/requests';
export const action = async (state) => {

  let data = null;

  if (fetchLocal === undefined) {
    const response = await fetch(`/graphql?query={requests{title,status,character_name,contract_count,expires,station,items{name,count}}}`,
                             { credentials: 'same-origin' });

    const json = await response.json();

    data = json.data;

  } else {
    const json = await fetchLocal(`/graphql?query={requests{title,status,character_name,contract_count,expires,station,items{name,count}}}`,
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
