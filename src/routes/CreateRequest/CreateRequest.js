/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Sidebar from '../../components/Sidebar';
import s from './CreateRequest.scss';
import cx from 'classnames';

/*
Contract request form

  Title
  Number of contracts wanted
  [ Items ]:
    Item Name, Item Amount
  Corp Only

  Submit
*/

class CreateRequest extends Component {

  render() {
    return (
      process.env.NODE_ENV !== undefined && process.env.NODE_ENV === 'production' ?
        <div className={s.root}>
          <Sidebar />
          <div className={s.container}>
            <h4>Create Contract Request</h4>
            <div>Coming Soon</div>
          </div>
        </div> :
      <div className={s.root}>
        <Sidebar />
        <div className={s.container}>
          <h4>Create Contract Request</h4>
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-12">
                <fieldset className="form-group">
                  <label htmlFor="create-request-title">Title</label>
                  <input type="text" className="form-control" id="create-request-title" placeholder="" />
                </fieldset>
                <fieldset className="form-group">
                  <label htmlFor="create-request-number">Number of Contracts</label>
                  <input type="number" className="form-control" id="create-request-number" placeholder="" />
                </fieldset>
                <fieldset className="form-group">
                  <label htmlFor="create-request-number">Number of Contracts</label>
                  <input type="number" className="form-control" id="create-request-number" placeholder="" />
                </fieldset>
                <div className="form-inline">
                  <fieldset className="form-group">
                    <label htmlFor="create-request-item">Item Name</label>
                    <input type="text" className="form-control" id="create-request-item" placeholder="" />
                  </fieldset>
                  <fieldset className="form-group">
                    <label htmlFor="create-request-itemcount">Amount</label>
                    <input type="number" className="form-control" id="create-request-itemcount" placeholder="" />
                  </fieldset>
                  <button type="submit" className={cx("btn", s.button_style)}>Add Items</button>
                </div>
                <div className={cx("checkbox", s.form_checkbox)}>
                  <label>
                    <input type="checkbox" id="create-request-corponly" /> Corp Only
                  </label>
                </div>
                <button type="submit" className={cx("btn", s.button_style)}>Submit Request</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(CreateRequest, s);
