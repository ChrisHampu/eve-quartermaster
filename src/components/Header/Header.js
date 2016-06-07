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
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Header.scss';
import Link from '../Link';
import Navigation from '../Navigation';
import cx from 'classnames';
import fetch from '../../core/fetch';

class Header extends Component {

  static contextTypes = {
    getUser: PropTypes.func,
    getSession: PropTypes.func
  }

  static propTypes = {
    path: PropTypes.string
  };

  constructor(props) {
    super(props);

    this.state = {
      notifications: [],
      showDrawer: false,
      showMobileMenu: false
    };
  }

  async componentDidMount() {

    let notifications = [];

    try {
      if (fetch !== undefined) {
        const response = await fetch(`/graphql?query={notifications{viewed,text,time,id}}`, // eslint-disable-line object-curly-spacing
                     { credentials: 'same-origin', headers: { Authorization: this.context.getSession() } });

        const json = await response.json();

        notifications = json.data.notifications || [];
      }
    } catch (err) { // eslint-disable-line no-empty
    }

    this.setState({ // eslint-disable-line react/no-did-mount-set-state
      notifications: notifications
    });
  }

  countUnreadNotifications() {

    return this.state.notifications.filter((alert) => {
      return alert.viewed === false;
    }).length;
  }

  toggleNotificationDrawer() {

    this.setState({
      showDrawer: !this.state.showDrawer
    }, () => {

      // Tell server to mark the currently viewed notifications as read

      const unread = this.state.notifications.filter((alert) => {
        return alert.viewed === false;
      }).map((alert) => {
        return alert.id;
      });

      if (!unread.length) {
        return;
      }

      // TODO: Change graphQL interface to accept a list?
      for (var id of unread) {
        fetch(`/graphql?query={viewNotification(id:${id})}`, // eslint-disable-line object-curly-spacing
                     { credentials: 'same-origin', headers: { Authorization: this.context.getSession() } });
      }

      setTimeout(() => {

        this.markNotificationsRead();
      }, 1500);
    });
  }

  closeNotificationDrawer() {

    this.setState({
      showDrawer: false
    });
  }

  markNotificationsRead() {

    // Check if even necessary
    if (!this.countUnreadNotifications()) {
      return;
    }

    for (var alert of this.state.notifications) {
      alert.viewed = true;
    }

    this.setState({
      notifications: this.state.notifications
    });
  }

  prettyTime(alert) {

    var d;
    var h;
    var m;
    var sec;
    const time = new Date(alert.time); // eslint-disable-line prefer-template

    const ms = Date.now() - time;

    sec = Math.floor(ms / 1000);
    m = Math.floor(sec / 60);
    sec = sec % 60;
    h = Math.floor(m / 60);
    m = m % 60;
    d = Math.floor(h / 24);
    h = h % 24;

    let msg = "";

    if (d > 0) {
      msg = `${d} ${d === 1 ? 'day' : 'days'}`;
    } else if (h > 0) {
      msg = `${h} ${h === 1 ? 'hour' : 'hours'}`;
    } else if (m > 0) {
      msg = `${m}  ${m === 1 ? 'minute' : 'minutes'}`;
    } else {
      msg = `${sec} seconds`;
    }

    return `${msg} ago.`; // eslint-disable-line prefer-template
  }

  toggleMobileMenu(show) {

    this.setState({
      showMobileMenu: show !== undefined ? show : !this.state.showMobileMenu
    });
  }

  render() {
    return (
      <div className={s.root}>
        <div className={s.logo_container}>
          <div className={s.logo_text}>
            EVE Quartermaster
          </div>
          <div className={cx(s.logo_text, s.logo_text_short)}>
            EVE QM
          </div>
          <div onClick={() => { this.toggleMobileMenu(); }} className={s.mobile_menu_toggle}>
            <i className="fa fa-bars" aria-hidden="true"></i>
          </div>
        </div>
        <Navigation path={this.props.path} />
        <div className={cx("pull-xs-right", s.content_right)}>
          <div className={s.user_info} onMouseLeave={() => { this.closeNotificationDrawer(); }} onClick={() => { this.toggleNotificationDrawer(); }}>
            <div className={s.user_image}>
              <img src={`https://image.eveonline.com/Character/${this.context.getUser().id}_64.jpg`} />
            </div>
            <div className={s.user_name_block}>
              <div className={s.user_name}>
                {this.context.getUser().name}
              </div>
              <div className={s.user_corp}>
                {this.context.getUser().corp_name}
              </div>
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
                        <div className={s.text}>{alert.text} {this.prettyTime(alert)}</div>
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
        <div className={cx(s.mobile_menu, this.state.showMobileMenu ? s.mobile_menu_visible : {})}>
          <div className={s.logo_text}>
            EVE Quartermaster
          </div>
          <div className={s.user_info} onMouseLeave={(ev) => { ev.stopPropagation(); this.closeNotificationDrawer(); }} onClick={(ev) => { ev.stopPropagation(); this.toggleNotificationDrawer(); }}>
            <div className={s.user_image}>
              <img src={`https://image.eveonline.com/Character/${this.context.getUser().id}_64.jpg`} />
            </div>
            <div className={s.user_name_block}>
              <div className={s.user_name}>
                {this.context.getUser().name}
              </div>
              <div className={s.user_corp}>
                {this.context.getUser().corp_name}
              </div>
            </div>
            <div className={this.countUnreadNotifications() > 0 ? cx(s.notification_counter, s.has_notifications) : s.notification_counter}>
              {this.countUnreadNotifications()}
            </div>
            <div className={cx(s.notification_drawer, s.list, this.state.showDrawer ? s.show : {})}>
              {
                this.state.notifications.length > 0 ?
                  this.state.notifications.map((alert, i) => {

                    return (<div className={cx(s.notification, alert.viewed === false ? s.unread : {})} key={i}>
                      <div className={s.status}>
                        <div className={s.marker} />
                      </div>
                      <div className={s.text}>{alert.text} {this.prettyTime(alert)}</div>
                    </div>);
                  })
                :
                <span>No new notifications.</span>
              }
            </div>
            <div className={cx(s.notification_tail, this.state.showDrawer ? s.show : {})}></div>
          </div>
          <Navigation path={this.props.path} className={s.mobile_nav} />
        </div>
        <div onClick={() => { this.toggleMobileMenu(false); }} className={cx(s.mobile_menu_overlay, this.state.showMobileMenu ? s.mobile_menu_visible : {})} />
      </div>
    );
  }
}

export default withStyles(s)(Header);
