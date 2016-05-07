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
import Sidebar from '../../components/Sidebar';
import Link from '../../components/Link';
import s from './ViewContracts.scss';
import cx from 'classnames';

class ViewContracts extends Component {

  static propTypes = {

    contracts: PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);

    this.toggleShowStatus = this.toggleShowStatus.bind(this);

    this.state = {
      contracts: this.props.contracts,
      showStatus: {
        Outstanding: true,
        Deleted: false,
        Completed: false,
        Failed: false,
        CompletedByIssuer: false,
        CompletedByContractor: false,
        Cancelled: false,
        Rejected: false,
        Reversed: false,
        InProgress: false,
      },
      showType: {
        ItemExchange: true,
        Courier: false,
        Loan: false,
        Auction: false
      },
      sortBy: {
        price: true,
        dateIssued: false,
        title: false
      }
    }
  }

  componentWillMount() {

  }

  componendDidMount() {

  }

  toggleShowStatus(status) {

  }

  updateContracts() {

    let contracts = this.props.contracts.filter( contract => this.state.showStatus[contract.status] === true && 
      this.state.showType[contract.type] === true );

    this.setState({ contracts: contracts });
  }

  render () {

    return (
      <div className={s.root}>
        <Sidebar>
          <div className={s.sidebar_header}>
            Status
          </div>
          <ul role="navigation" className={cx(s.nav_container, 'nav')}>
            <li className="nav-item">
              <div className="checkbox">
                <label className={s.nav_label} >
                  <input type="checkbox" className={s.nav_checkbox}/>
                  Outstanding
                </label>
              </div>
            </li>
            <li className="nav-item">
              <div className="checkbox">
                <label className={s.nav_label}>
                  <input type="checkbox" className={s.nav_checkbox}/>
                  In Progress
                </label>
              </div>
            </li>
            <li className="nav-item">
              <div className="checkbox">
                <label className={s.nav_label}>
                  <input type="checkbox" className={s.nav_checkbox}/>
                  Completed
                </label>
              </div>
            </li>
            <li className="nav-item">
              <div className="checkbox">
                <label className={s.nav_label}>
                  <input type="checkbox" className={s.nav_checkbox}/>
                  Deleted
                </label>
              </div>
            </li>
          </ul>
        </Sidebar>
        <div className={s.container}>
          <ul>
          { this.state.contracts.map((contract) => {
            return <li key={contract.id}>{contract.title}</li>
          })}
          </ul>
        </div>
      </div>
    );
  }
}

export default withStyles(ViewContracts, s);
