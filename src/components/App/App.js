/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component, PropTypes } from 'react';
import emptyFunction from 'fbjs/lib/emptyFunction';
import cx from 'classnames';
import s from './App.scss';
import Header from '../Header';
import Footer from '../Footer';

import bs from '../../core/bootstrap/scss/bootstrap.scss';
import fa from '../../core/fontawesome/font-awesome.scss';
import app from '../../core/app.scss';

class App extends Component {

  static propTypes = {
    context: PropTypes.shape({
      insertCss: PropTypes.func,
      onSetTitle: PropTypes.func,
      onSetMeta: PropTypes.func,
      onPageNotFound: PropTypes.func,
      isAuthed: PropTypes.func,
      getLocation: PropTypes.func,
    }),
    children: PropTypes.element.isRequired,
    error: PropTypes.object,
  };

  static childContextTypes = {
    insertCss: PropTypes.func.isRequired,
    onSetTitle: PropTypes.func.isRequired,
    onSetMeta: PropTypes.func.isRequired,
    onPageNotFound: PropTypes.func.isRequired,
    getLocation: PropTypes.func.isRequired || emptyFunction,
  };

  getChildContext() {
    const context = this.props.context;
    return {
      insertCss: context.insertCss || emptyFunction,
      onSetTitle: context.onSetTitle || emptyFunction,
      onSetMeta: context.onSetMeta || emptyFunction,
      onPageNotFound: context.onPageNotFound || emptyFunction,
      getLocation: context.getLocation || emptyFunction,
    };
  }

  componentWillMount() {
    const { insertCss } = this.props.context;

    this.removeCss = [insertCss(bs), insertCss(fa), insertCss(app), insertCss(s)];
  }

  componentWillUnmount() {
    this.removeCss();
  }

  render() {

    return !this.props.error ? (
      <div className={s.root}>
        <Header path={this.props.context.getLocation()} />
        <div className={cx(s.container)}>
            <div className={cx(s.page, 'col-md-12')}>
              { this.props.children }
            </div>
        </div>
        <Footer />
      </div>
    ) : this.props.children;
  }

}

export default App;
