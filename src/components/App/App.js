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
import Sidebar from '../Sidebar';
import LoginPage from '../LoginPage';

class App extends Component {

  static propTypes = {
    context: PropTypes.shape({
      insertCss: PropTypes.func,
      onSetTitle: PropTypes.func,
      onSetMeta: PropTypes.func,
      onPageNotFound: PropTypes.func,
      isAuthed: PropTypes.func
    }),
    children: PropTypes.element.isRequired,
    error: PropTypes.object,
  };

  static childContextTypes = {
    insertCss: PropTypes.func.isRequired,
    onSetTitle: PropTypes.func.isRequired,
    onSetMeta: PropTypes.func.isRequired,
    onPageNotFound: PropTypes.func.isRequired,
    isAuthed: PropTypes.func.isRequired
  };

  getChildContext() {
    const context = this.props.context;
    return {
      insertCss: context.insertCss || emptyFunction,
      onSetTitle: context.onSetTitle || emptyFunction,
      onSetMeta: context.onSetMeta || emptyFunction,
      onPageNotFound: context.onPageNotFound || emptyFunction,
      isAuthed: context.isAuthed || emptyFunction,
    };
  }

  componentWillMount() {
    const { insertCss } = this.props.context;
    this.removeCss = insertCss(s);
  }

  componentWillUnmount() {
    this.removeCss();
  }

  render() {

    return !this.props.error ? (
      <div className={s.root}>
        <Header />
        <div className={cx(s.container, 'container')}>
          <div className="row">
            <Sidebar className="col-md-3"/>
            <div className={cx(s.page, 'col-md-9')}>
              {
                this.props.context.isAuthed !== undefined && this.props.context.isAuthed() ? 
                this.props.children : <LoginPage />
              }
            </div>       
          </div>        
        </div>
        <Footer />
      </div>
    ) : this.props.children;
  }

}

export default App;
