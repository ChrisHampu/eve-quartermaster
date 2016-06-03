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

import Promise from 'bluebird';
import fetch from 'fetch';
import { host } from '../../config';

function localUrl(url) {
  if (url.startsWith('//')) {
    return `https:${url}`;
  }

  if (url.startsWith('http')) {
    return url;
  }

  return `http://${host}${url}`;
}

function Response(body) {

  this.body = body;
}

Response.prototype.json = function() {

  return JSON.parse(this.body);
}

Response.prototype.text = function() {

  return this.body
}

function Fetch(url, options) {

  const opts = options || {};

  // Use a custom user agent when accessing data from the server
  if (!opts.headers) {
    opts.headers = { "User-Agent": "EVE Quartermaster" };
  } else {
    opts.headers["User-Agent"] = "EVE Quartermaster";
  }

  return new Promise((resolve) => {

    fetch.fetchUrl(localUrl(url), opts, (err, meta, body) => {

      return resolve(new Response(body.toString()));
    });
  });
}

export { Fetch as default };
