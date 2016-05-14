/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import CreateRequest from './CreateRequest';

export const path = '/create';
export const action = async (state) => {
  state.context.onSetTitle('57th Eve Contracts');
  return <CreateRequest />;
};
