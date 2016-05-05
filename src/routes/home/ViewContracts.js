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
import s from './ViewContracts.scss';

class ViewContracts extends Component {

  render () {
    return (
      <div className={s.root}>
        <Sidebar/>
        <div className={s.container}>
          <h1 className={s.title}>React.js News</h1>
        </div>
      </div>
    );
  }
}

export default withStyles(ViewContracts, s);
