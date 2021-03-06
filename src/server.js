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

import 'babel-polyfill';
import path from 'path';
import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import expressGraphQL from 'express-graphql';
import jwt from 'jsonwebtoken';
import ReactDOM from 'react-dom/server';
import PrettyError from 'pretty-error';
import passport from './core/passport';
import schema from './data/schema';
import Router from './routes';
import assets from './assets';
import { port, auth, analytics, databaseUrl, eve, host } from './config';
import verifySession from './core/verifySession';
import sequelize from 'sequelize';
import connectSessionSequelize from 'connect-session-sequelize';

const server = global.server = express();

//
// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
// user agent is not known.
// -----------------------------------------------------------------------------
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
server.use(express.static(path.join(__dirname, 'public')));
server.use(cookieParser());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

//
// Session management
// -----------------------------------------------------------------------------
const sequelizeDB = new sequelize(databaseUrl, { logging: false }); // eslint-disable-line new-cap

const sessionDB = sequelizeDB.define('session', { // eslint-disable-line no-unused-vars
  sid: {
    type: sequelize.STRING,
    primaryKey: true
  },
  expires: sequelize.DATE,
  data: sequelize.TEXT,
  createdAt: sequelize.DATE,
  updatedAt: sequelize.DATE
},
{
  tableName: 'session',
  freezeTableName: true
});

server.use(session({
  secret: auth.session.secret,
  name: 'EVEQMSession',
  store: new (connectSessionSequelize(session.Store))({ // eslint-disable-line new-cap
    db: sequelizeDB,
    table: 'session',
  }),
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

//
// Authentication
// -----------------------------------------------------------------------------

server.use(passport.initialize());
server.use(passport.session());

server.get('/auth',
  passport.authenticate('eveonline', {
    successRedirect: '/',
    failureRedirect: '/unauthorized',
    scope: 'remoteClientUI'
  })
);

server.get('/callback', (req, res, next) => {
  passport.authenticate('eveonline', { scope: "remoteClientUI" }, (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      const template = require('./views/unauthorized.jade');

      res.status(200);

      res.send(template({
        message: info.message,
      }));
    } else {

      req.login(user, (error) => {
        if (error) {
          const template = require('./views/unauthorized.jade');

          res.status(200);

          res.send(template({
            message: info.message,
          }));

        } else {

          try {

            req.session.jwt = jwt.sign(user, auth.jwt.secret); // eslint-disable-line no-param-reassign
            req.session.save();

            // Instead of performing a redirect, create a fake request to the root path and render that page
            serverRenderingHandler({ // eslint-disable-line no-use-before-define
              path: '/',
              query: {},
              session: req.session,
              isAuthenticated: () => req.isAuthenticated // Also need to fake the functions being used in the rendering handler
            }, res, next);

          } catch (_err) {

            next(_err);
          }
        }
      });
    }

    return; // eslint-disable-line consistent-return
  })(req, res, next);
});

server.get('/unauthorized', (req, res) => {

  const template = require('./views/unauthorized.jade');

  res.status(200);

  res.send(template({
    message: 'Your corporation or alliance does not have access to this page',
  }));
});

server.get('/logout', (req, res) => {

  req.session.jwt = null; // eslint-disable-line no-param-reassign
  req.logout();

  res.redirect('/');
});

server.use('/graphql', (req, res, next) => {

  const sess = req.session;
  const token = req.get("Authorization");

  if (token) {
    sess.jwt = req.session.jwt || token;
  }

  console.log(req.ip);
  console.log(req.originalUrl);
  console.log(sess.jwt);

  expressGraphQL(request => ({
    schema,
    graphiql: process.env.NODE_ENV !== 'production',
    rootValue: { request: request }, // eslint-disable-line object-shorthand
    pretty: process.env.NODE_ENV !== 'production',
    context: sess,
  }))(req, res, next);
});

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
async function serverRenderingHandler(req, res, next) {
  try {

    let statusCode = 200;

    const template = require('./views/index.jade');
    const data = { title: '', description: '', css: '', body: '', entry: assets.main.js, token: '' };

    if (process.env.NODE_ENV === 'production') {
      data.trackingId = analytics.google.trackingId;
    }

    if (req.session.jwt) {
      data.token = req.session.jwt;
    }

    const css = [];
    const context = {
      insertCss: styles => css.push(styles._getCss()),
      onSetTitle: value => (data.title = value),
      onSetMeta: (key, value) => (data[key] = value),
      onPageNotFound: () => (statusCode = 404),
      getLocation: () => req.path,
      getUser: () => req.user || null,
      getSession: () => req.session.jwt || null,
    };

    let newPath = req.path;

    if (!req.isAuthenticated() && !req.session.jwt) {

      newPath = '/unauthorized';
    } else {

      const authed = await verifySession(req.session);

      if (!authed.authenticated) {

        newPath = '/unauthorized';
      } else {

       req.user = req.user || authed; // eslint-disable-line no-param-reassign
      }
    }

    await Router.dispatch({ path: newPath, query: req.query, context }, (state, component) => {

      data.body = ReactDOM.renderToString(component);
      data.css = css.join('');
    });

    res.status(statusCode);
    res.send(template(data));

  } catch (err) {
    next(err);
  }
}

server.get('*', serverRenderingHandler);

//
// Error handling
// -----------------------------------------------------------------------------
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

server.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.log(pe.render(err)); // eslint-disable-line no-console
  const template = require('./views/error.jade');
  const statusCode = err.status || 500;
  res.status(statusCode);
  res.send(template({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '' : err.stack,
  }));
});

//
// Launch the server
// -----------------------------------------------------------------------------
server.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`The server is running at ${host}`);
  console.log(`Using SSO callback url ${auth.eve.callback}`);
  console.log(`Environment is ${process.env.NODE_ENV || 'debug'}`);
  console.log(`Corporation ID set to ${eve.corp_id} and alliance ID set to ${eve.alliance_id}`);
  console.log(`Alliance access is ${eve.corp_only === 'true' ? 'disabled' : 'enabled'}`);
  console.log(`API key in use is ${eve.corp_key}.${eve.corp_vcode}`);
});
