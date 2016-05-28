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

class Header extends Component {

  static contextTypes = {
    getUser: PropTypes.func
  }

  static propTypes = {
    path: PropTypes.string
  };

  constructor(props) {
    super(props);

    this.state = {};
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
        <div className="pull-xs-right">
          <div className={s.user_info}>
            <img className={s.user_image} src={`https://image.eveonline.com/Character/${this.context.getUser().id}_64.jpg`} />
            {this.context.getUser().name}
          </div>
          <Link to="/logout" className={s.logout_button} useButtonStyle={true}>
            Logout
          </Link>
        </div>
      </div>
    );
  }
}

export default withStyles(Header, s);
