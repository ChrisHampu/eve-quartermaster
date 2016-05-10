/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* eslint-disable max-len */
/* jscs:disable maximumLineLength */

export const port = process.env.PORT || 3000;
export const host = process.env.WEBSITE_HOSTNAME || `localhost:${port}`;

export const eve = {
  corp_key: process.env.CORPORATION_KEY || '5278627',
  corp_vcode: process.env.CORPORATION_VCODE || 'Te7P9YRA597tVsa1k8G57mwTRIcGVz4duBpWhd12duWpab6k51xaCSUivwD6Rtfm',
  corp_access: 8388608,
  corp_id: 98388312,
  alliance_id: 99005397,
  contractType: {
    "ItemExchange": 0,
    "Courier": 1,
    "Loan": 2,
    "Auction": 3
  },
  contractStatus: {
    "Outstanding": 0,
    "Deleted": 1,
    "Completed": 2,
    "Failed": 3,
    "CompletedByIssuer": 4,
    "CompletedByContractor": 5,
    "Cancelled": 6,
    "Rejected": 7,
    "Reversed": 8,
    "InProgress": 9,
  }
};

export const databaseUrl = process.env.DATABASE_URL || 'postgresql://postgres:Chris231@127.0.0.1:5432/postgres?ssl=false';

export const analytics = {

  // https://analytics.google.com/
  google: { trackingId: process.env.GOOGLE_TRACKING_ID || 'UA-XXXXX-X' },

};

export const auth = {

  jwt: { secret: process.env.JWT_SECRET || 'EveContracts' },

  // https://developers.facebook.com/
  facebook: {
    id: process.env.FACEBOOK_APP_ID || 'value',
    secret: process.env.FACEBOOK_APP_SECRET || 'value',
  },

  // https://cloud.google.com/console/project
  google: {
    id: process.env.GOOGLE_CLIENT_ID || 'value',
    secret: process.env.GOOGLE_CLIENT_SECRET || 'value',
  },

  // https://apps.twitter.com/
  twitter: {
    key: process.env.TWITTER_CONSUMER_KEY || 'value',
    secret: process.env.TWITTER_CONSUMER_SECRET || 'value',
  },

  eve: {
    id: process.env.EVE_CLIENT_ID || 'value',
    secret: process.env.EVE_SECRET_KEY || 'value',
    callback: 'http://localhost:3001/callback'
  }

};
