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
import fetch from '../../core/fetch';

export const path = '/requests';
export const action = async (state) => {
  //const response = await fetch('/graphql?query={news{title,link,contentSnippet}}');
  //const { data } = await response.json();
  state.context.onSetTitle('57th Eve Contracts');
  return <ViewRequests/>;
};
