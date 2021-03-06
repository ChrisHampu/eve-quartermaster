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

/* eslint-disable max-len */
/* jscs:disable maximumLineLength */

export const port = process.env.PORT || 3000;
export const host = process.env.WEBSITE_HOSTNAME || `localhost:${port}`;

export const eve = {
  corp_key: process.env.CORPORATION_KEY || '5364175',
  corp_vcode: process.env.CORPORATION_VCODE || 'value',
  corp_access: 8388608, // The api key access mask
  corp_id: process.env.CORPORATION_ID || '98388312',
  corp_only: process.env.CORP_ONLY || 'false', // If set to true, the alliance id is ignored. If false, alliance id must be valid
  alliance_id: process.env.ALLIANCE_ID || '99005338',
  contractType: {
    ItemExchange: 0,
    Courier: 1,
    Loan: 2,
    Auction: 3
  },
  contractStatus: {
    Outstanding: 0,
    Deleted: 1,
    Completed: 2,
    Failed: 3,
    CompletedByIssuer: 4,
    CompletedByContractor: 5,
    Cancelled: 6,
    Rejected: 7,
    Reversed: 8,
    InProgress: 9,
  }
};

export const databaseUrl = process.env.DATABASE_URL || 'value';

export const analytics = {

  // https://analytics.google.com/
  google: { trackingId: process.env.GOOGLE_TRACKING_ID || 'UA-XXXXX-X' },

};

export const auth = {

  jwt: { secret: process.env.JWT_SECRET || 'EveContracts' },
  session: { secret: process.env.SESSION_SECRET || 'EveSessions' },

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
    // The following API settings only work on a local deployment
    id: process.env.EVE_CLIENT_ID || 'value',
    secret: process.env.EVE_SECRET_KEY || 'value',
    callback: process.env.EVE_CALLBACK_URL || 'http://localhost:3001/callback'
  }

};
