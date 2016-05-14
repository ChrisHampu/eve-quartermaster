/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Navigation.scss';
import Link from '../Link';

class Navigation extends Component {

  static propTypes = {
    className: PropTypes.string,
    path: PropTypes.string
  };

  render() {
    return (
      <nav role="navigation" className={cx(s.nav_container, 'nav', 'nav-inline')}>
        <Link className={cx('nav-link', s.nav_link)} activeClass={s.nav_link_active} to="/" path={this.props.path}>View Contracts</Link>
        <Link className={cx('nav-link', s.nav_link)} activeClass={s.nav_link_active} to="/requests" path={this.props.path}>View Requests</Link>
        <Link className={cx('nav-link', s.nav_link)} activeClass={s.nav_link_active} to="/create" path={this.props.path}>Create Request</Link>
      </nav>
    );
  }
}

export default withStyles(Navigation, s);
