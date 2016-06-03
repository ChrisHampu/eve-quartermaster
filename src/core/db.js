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

import db from 'pg';
import Promise from 'bluebird';
import { databaseUrl } from '../config';

// TODO: Customize database connection settings
/* jscs:disable requireCamelCaseOrUpperCaseIdentifiers */
db.defaults.ssl = false;
db.defaults.poolSize = 2;
db.defaults.application_name = 'RSK';
/* jscs:enable requireCamelCaseOrUpperCaseIdentifiers */

/**
 * Promise-based wrapper for pg.Client
 * https://github.com/brianc/node-postgres/wiki/Client
 */
function AsyncClient(client) {
  this.client = client;
  this.query = this.query.bind(this);
  this.end = this.end.bind(this);
}

AsyncClient.prototype.query = function query(sql, ...args) {
  return new Promise((resolve, reject) => {
    if (args.length) {
      this.client.query(sql, args, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    } else {
      this.client.query(sql, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    }
  });
};

AsyncClient.prototype.end = function end() {
  this.client.end();
};

/**
 * Promise-based wrapper for pg.connect()
 * https://github.com/brianc/node-postgres/wiki/pg
 */
db.connect = (connect => callback => new Promise((resolve, reject) => {
  connect.call(db, databaseUrl, (err, client, done) => {
    if (err) {
      if (client) {
        done(client);
      }

      reject(err);
    } else {
      callback(new AsyncClient(client)).then(() => {
        done();
        resolve();
      }).catch(error => {
        done(client);
        reject(error);
      });
    }
  });
}))(db.connect);

export default db;
