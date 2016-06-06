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

import React, { Component, PropTypes } from 'react';
import emptyFunction from 'fbjs/lib/emptyFunction';
import cx from 'classnames';
import s from './App.scss';
import Header from '../Header';

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
      getUser: PropTypes.func,
      getSession: PropTypes.func
    }),
    children: PropTypes.element.isRequired,
    error: PropTypes.object,
  };

  static childContextTypes = {
    insertCss: PropTypes.func.isRequired,
    onSetTitle: PropTypes.func.isRequired,
    onSetMeta: PropTypes.func.isRequired,
    onPageNotFound: PropTypes.func.isRequired,
    getLocation: PropTypes.func.isRequired,
    getUser: PropTypes.func.isRequired,
    getSession: PropTypes.func.isRequired,
  };

  getChildContext() {
    const context = this.props.context;
    return {
      insertCss: context.insertCss || emptyFunction,
      onSetTitle: context.onSetTitle || emptyFunction,
      onSetMeta: context.onSetMeta || emptyFunction,
      onPageNotFound: context.onPageNotFound || emptyFunction,
      getLocation: context.getLocation || emptyFunction,
      getUser: context.getUser || emptyFunction,
      getSession: context.getSession || emptyFunction
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
      </div>
    ) : this.props.children;
  }

}

export default App;
