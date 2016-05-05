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

	static propTypes = {
    	path: PropTypes.string
	};

	render() {
		return (
			<div className={s.root}>
				<div className={s.logo_container}>
					<div className={s.logo_text}>
						Eve Quartermaster
					</div>
				</div>
				<Navigation path={this.props.path}/>
				<a href="/logout" className={s.logout_button}>
					Logout
				</a>
			</div>
		);
	}
}

export default withStyles(Header, s);
