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
		    	<div className={s.sidebar_header}>
		    		Sorting
		    	</div>
		        <ul role="navigation" className={cx(s.nav_container, 'nav')}>
		        	<li className="nav-item">
		        		<div className="checkbox">
						    <label>
						      <input type="checkbox" className={s.nav_checkbox}/><Link className={cx('nav-link', s.nav_link)} to="/">ISK (Low)</Link>
						    </label>
						</div>
		    		</li>
		    		<li className="nav-item">
		        		<div className="checkbox">
						    <label>
						      <input type="checkbox" className={s.nav_checkbox}/><Link className={cx('nav-link', s.nav_link)} to="/">ISK (High)</Link>
						    </label>
						</div>
		    		</li>
		    		<li className="nav-item">
		        		<div className="checkbox">
						    <label>
						      <input type="checkbox" className={s.nav_checkbox}/><Link className={cx('nav-link', s.nav_link)} to="/">Checkbox</Link>
						    </label>
						</div>
		    		</li>
		    	</ul>
		    	<div className={s.sidebar_header}>
		    		Other
		    	</div>
		        <ul role="navigation" className={cx(s.nav_container, 'nav')}>
		        	<li className="nav-item">
		        		<div className="checkbox">
						    <label>
						      <input type="checkbox" className={s.nav_checkbox}/><Link className={cx('nav-link', s.nav_link)} to="/">ISK (Low)</Link>
						    </label>
						</div>
		    		</li>
		    		<li className="nav-item">
		        		<div className="checkbox">
						    <label>
						      <input type="checkbox" className={s.nav_checkbox}/><Link className={cx('nav-link', s.nav_link)} to="/">ISK (High)</Link>
						    </label>
						</div>
		    		</li>
		    		<li className="nav-item">
		        		<div className="checkbox">
						    <label>
						      <input type="checkbox" className={s.nav_checkbox}/><Link className={cx('nav-link', s.nav_link)} to="/">Checkbox</Link>
						    </label>
						</div>
		    		</li>
		    	</ul>
	    	</div>
	    </div>
	  );
	}
}

export default withStyles(Sidebar, s);
