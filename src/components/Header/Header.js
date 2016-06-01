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
      notifications: [],
      showDrawer: true
    };
  }

  componentDidMount() {

  }

  countUnreadNotifications() {

    return this.state.notifications.filter((alert) => {
      return alert.viewed === false;
    }).length;
  }

  toggleNotificationDrawer() {

    this.setState({
      showDrawer: !this.state.showDrawer
    });
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
          <div className={s.user_info} onClick={() => { this.toggleNotificationDrawer(); }}>
            <div className={s.user_image}>
              <img src={`https://image.eveonline.com/Character/${this.context.getUser().id}_64.jpg`} />
            </div>
            <div className={s.user_name}>
              {this.context.getUser().name}
            </div>
            <div className={this.countUnreadNotifications() > 0 ? cx(s.notification_counter, s.has_notifications) : s.notification_counter}>
              {this.countUnreadNotifications()}
            </div>
            <div className={cx(s.notification_drawer, this.state.showDrawer ? s.show : {})}>
              <div className={s.notification_header}>
              Notifications
              </div>
              <div className={s.list}>
                {
                  this.state.notifications.length > 0 ?
                    this.state.notifications.map((alert, i) => {

                      return (<div className={cx(s.notification, alert.viewed === false ? s.unread : {})} key={i}>
                        <div className={s.status}>
                          <div className={s.marker} />
                        </div>
                        <div className={s.text}>{alert.text}</div>
                      </div>);
                    })
                  :
                  <span>No new notifications.</span>
                }
              </div>
              <div className={s.notification_tail}></div>
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
