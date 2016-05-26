/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
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
import { port, auth, analytics, databaseUrl } from './config';
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
},
{
  tableName: 'session',
  freezeTableName: true
});

server.use(session({
  secret: auth.session.secret,
  name: 'EVEContractsSess',
  store: new (connectSessionSequelize(session.Store))({ // eslint-disable-line new-cap
    db: sequelizeDB,
    table: 'session',
  }),
  resave: false,
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
  })
);

server.get('/callback', (req, res, next) => {
  passport.authenticate('eveonline', (err, user, info) => {
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
        }

        req.session.jwt = jwt.sign(user, auth.jwt.secret); // eslint-disable-line no-param-reassign

        res.redirect('/');
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

  req.logout();

  res.redirect('/');
});

server.use('/graphql', (req, res, next) => {

  expressGraphQL(request => ({
    schema,
    graphiql: process.env.NODE_ENV !== 'production',
    rootValue: { request: request }, // eslint-disable-line object-shorthand
    pretty: process.env.NODE_ENV !== 'production',
    context: req.session,
  }))(req, res, next);
});


//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
server.get('*', async (req, res, next) => {
  try {

    let statusCode = 200;

    const template = require('./views/index.jade');
    const data = { title: '', description: '', css: '', body: '', entry: assets.main.js };

    if (process.env.NODE_ENV === 'production') {
      data.trackingId = analytics.google.trackingId;
    }

    const css = [];
    const context = {
      insertCss: styles => css.push(styles._getCss()),
      onSetTitle: value => (data.title = value),
      onSetMeta: (key, value) => (data[key] = value),
      onPageNotFound: () => (statusCode = 404),
      getLocation: () => req.path,
      getUser: () => req.user || null,
      getSession: () => req.headers.cookie || null,
    };

    let newPath = req.path;

    if (!req.isAuthenticated()) {
      newPath = '/unauthorized';
    } else {

      const authed = await verifySession(req.session);

      if (!authed.authenticated) {
        newPath = '/unauthorized';
      }
    }

    console.log("session");
    console.log(req.session);
    console.log(`Path adjusted to ${newPath}. User: `);
    console.log(req.user);

    await Router.dispatch({ path: newPath, query: req.query, context }, (state, component) => {

      data.body = ReactDOM.renderToString(component);
      data.css = css.join('');
    });

    res.status(statusCode);
    res.send(template(data));

  } catch (err) {
    next(err);
  }
});

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
  console.log(`The server is running at http://localhost:${port}/`);
  console.log(`Using SSO callback url ${auth.eve.callback}`);
  console.log(`Environment is ${process.env.NODE_ENV || 'debug'}`);
});
