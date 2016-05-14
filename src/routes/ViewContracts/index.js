/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
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
