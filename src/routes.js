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
import Router from 'react-routing/src/Router';
import fetch from './core/fetch';
import App from './components/App';
import NotFoundPage from './components/NotFoundPage';
import ErrorPage from './components/ErrorPage';
import LoginPage from './components/LoginPage';

const routes = [
  require('./routes/ViewContracts'),
  require('./routes/ViewRequests'),
  require('./routes/CreateRequest'),
  require('./routes/About')
];

const router = new Router(on => {

  on('/unauthorized', async (state) => { return <App context={state.context} error={ "unauthorized" }><LoginPage /></App>; });

  on('/logout', async (state) => {

    await fetch('/logout', { credentials: 'same-origin' });

    return <App context={state.context} error={ "logged out" }><LoginPage /></App>;
  });

  on('*', async (state, next) => {

    const component = await next();
    return component && <App context={state.context}>{component}</App>;
  });

  routes.forEach(route => {
    on(route.path, route.action);
  });

  on('error', (state, error) => state.statusCode === 404 ?
    <App context={state.context} error={error}><NotFoundPage /></App> :
    <App context={state.context} error={error}><ErrorPage /></App>
  );
});

export default router;
