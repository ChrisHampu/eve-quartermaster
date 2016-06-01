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
import s from './Header.scss';
import Link from '../Link';
import Navigation from '../Navigation';
import cx from 'classnames';

class Header extends Component {

  static contextTypes = {
    getUser: PropTypes.func
  }

  static propTypes = {
    path: PropTypes.string
  };

  constructor(props) {
    super(props);

    this.state = {
      notifications: []
    };
  }

  render() {
    return (
      <div className={s.root}>
        <div className={s.logo_container}>
          <div className={s.logo_text}>
            EVE Quartermaster
          </div>
        </div>
        <Navigation path={this.props.path} />
        <div className={cx("pull-xs-right", s.content_right)}>
          <div className={s.user_info}>
            <div className={s.user_image}>
              <img src={`https://image.eveonline.com/Character/${this.context.getUser().id}_64.jpg`} />
            </div>
            <div className={s.user_name}>
              {this.context.getUser().name}
            </div>
            <div className={this.state.notifications.length > 0 ? cx(s.notification_counter, s.has_notifications) : s.notification_counter}>
              {this.state.notifications.length}
            </div>
          </div>
          <div className={s.logout_button}>
            <Link to="/logout" useButtonStyle={true}>
              Logout
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(Header, s);
