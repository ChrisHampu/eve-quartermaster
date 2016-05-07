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
import s from './ViewRequests.scss';
import cx from 'classnames';

class ViewRequests extends Component {

  render () {
    return (
      <div className={s.root}>
        <Sidebar>
          <div className={s.sidebar_header}>
            Sort By
          </div>
          <ul role="navigation" className={cx(s.nav_container, 'nav')}>
            <li className="nav-item">
              <div className="checkbox">
                <label className={s.nav_label}>
                  <input type="checkbox" className={s.nav_checkbox}/>
                  ISK (Low)
                </label>
              </div>
            </li>
            <li className="nav-item">
              <div className="checkbox">
                <label className={s.nav_label}>
                  <input type="checkbox" className={s.nav_checkbox}/>
                  ISK (High)
                </label>
              </div>
            </li>
          </ul>
        </Sidebar>
        <div className={s.container}>
          
        </div>
      </div>
    );
  }
}

export default withStyles(ViewRequests, s);
