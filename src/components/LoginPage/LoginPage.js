/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './LoginPage.scss';
import Link from '../Link';
import cx from 'classnames';

function LoginPage() {
  return (
    <div className={s.root}>
    	<div className={cx("container-fluid", s.container)}>
    		<div className="row">
    			<div className="col-md-6 col-sm-6">
    				<div className={s.login_box}>
    					<div className={s.login_title}>
    						Eve Quartermaster
    					</div>
    					<a href="/auth" className={s.login_button}></a>
    				</div>
    			</div>
    		</div>
    	</div>
    </div>
  );
}

export default withStyles(LoginPage, s);
