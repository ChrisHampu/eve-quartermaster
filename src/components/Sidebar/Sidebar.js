/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */
import React, { Component } from 'react';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Sidebar.scss';
import Link from '../Link';

class Sidebar extends Component {

	render() {
	  return (
	    <div className={s.root}>
	    	<div className={s.container}>
	    		{ this.props.children }
	    	</div>
	    </div>
	  );
	}
}

export default withStyles(Sidebar, s);
