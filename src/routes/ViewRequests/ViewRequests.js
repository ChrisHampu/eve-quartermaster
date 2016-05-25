/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Sidebar from '../../components/Sidebar';
import s from './ViewRequests.scss';
// import cx from 'classnames';

class ViewRequests extends Component {

  render() {
    return (
      process.env.NODE_ENV !== undefined && process.env.NODE_ENV === 'production' ?
        <div className={s.root}>
          <Sidebar />
          <div className={s.container}>
            <h4>Active Contract Requests</h4>
            <div>Coming Soon</div>
          </div>
        </div> :
      <div className={s.root}>
        <Sidebar />
        <div className={s.container}>
            <h4>Active Contract Requests</h4>
            <div>Coming Soon</div>
        </div>
      </div>
    );
  }
}

export default withStyles(ViewRequests, s);
