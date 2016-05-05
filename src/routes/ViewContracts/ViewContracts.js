/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Sidebar from '../../components/Sidebar';
import Link from '../../components/Link';
import s from './ViewContracts.scss';
import cx from 'classnames';

class ViewContracts extends Component {

  render () {
    return (
      <div className={s.root}>
        <Sidebar>
          <div className={s.sidebar_header}>
            Sorting
          </div>
          <ul role="navigation" className={cx(s.nav_container, 'nav')}>
            <li className="nav-item">
              <div className="checkbox">
                <label>
                  <input type="checkbox" className={s.nav_checkbox}/><Link className={cx('nav-link', s.nav_link)} to="/">ISK (Low)</Link>
                </label>
              </div>
            </li>
            <li className="nav-item">
              <div className="checkbox">
                <label>
                  <input type="checkbox" className={s.nav_checkbox}/><Link className={cx('nav-link', s.nav_link)} to="/">ISK (High)</Link>
                </label>
              </div>
            </li>
            <li className="nav-item">
              <div className="checkbox">
                <label>
                  <input type="checkbox" className={s.nav_checkbox}/><Link className={cx('nav-link', s.nav_link)} to="/">Checkbox</Link>
                </label>
              </div>
            </li>
          </ul>
          <div className={s.sidebar_header}>
            Other
          </div>
          <ul role="navigation" className={cx(s.nav_container, 'nav')}>
            <li className="nav-item">
              <div className="checkbox">
                <label>
                  <input type="checkbox" className={s.nav_checkbox}/><Link className={cx('nav-link', s.nav_link)} to="/">ISK (Low)</Link>
                </label>
              </div>
            </li>
            <li className="nav-item">
              <div className="checkbox">
                <label>
                  <input type="checkbox" className={s.nav_checkbox}/><Link className={cx('nav-link', s.nav_link)} to="/">ISK (High)</Link>
                </label>
              </div>
            </li>
            <li className="nav-item">
              <div className="checkbox">
                <label>
                  <input type="checkbox" className={s.nav_checkbox}/><Link className={cx('nav-link', s.nav_link)} to="/">Checkbox</Link>
                </label>
              </div>
            </li>
          </ul>
        </Sidebar>
        <div className={s.container}>
          <h1 className={s.title}>React.js News</h1>
        </div>
      </div>
    );
  }
}

export default withStyles(ViewContracts, s);
