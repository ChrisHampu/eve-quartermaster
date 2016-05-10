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
    if(this.state.contracts.length === 0) {
      let contracts = [];

      for(var i = 0; i < 10; i++)
        contracts.push({title: "Test", price: 1000000, dateIssued: "test2", status: "Outstanding"});
    }
  }

  componendDidMount() {

  }

  toggleShowStatus(status) {

    let show = this.state.showStatus;
    show[status] = !this.state.showStatus[status];

    this.setState({ showStatus: show });

    this.updateContracts();
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
                  <input type="checkbox" className={s.nav_checkbox} onClick={()=>{ this.toggleShowStatus("Outstanding"); }}/>
                  Outstanding
                </label>
              </div>
            </li>
            <li className="nav-item">
              <div className="checkbox">
                <label className={s.nav_label}>
                  <input type="checkbox" className={s.nav_checkbox} onClick={()=>{ this.toggleShowStatus("InProgress"); }}/>
                  In Progress
                </label>
              </div>
            </li>
            <li className="nav-item">
              <div className="checkbox">
                <label className={s.nav_label}>
                  <input type="checkbox" className={s.nav_checkbox} onClick={()=>{ this.toggleShowStatus("Completed"); }}/>
                  Completed
                </label>
              </div>
            </li>
            <li className="nav-item">
              <div className="checkbox">
                <label className={s.nav_label}>
                  <input type="checkbox" className={s.nav_checkbox} onClick={()=>{ this.toggleShowStatus("Deleted"); }}/>
                  Deleted
                </label>
              </div>
            </li>
          </ul>
        </Sidebar>
        <div className={s.container}>
          <h4>Contracts</h4>
          <div className={cx("row", s.contract_header)}>
            <div className="col-md-6">Title</div>
            <div className="col-md-6">Price</div>
          </div>
          <ul className={cx(s.contract_list)}>
          { this.state.contracts.map((contract) => {
            return(
              <li key={contract.id} className="row">
                <div className="col-md-6">{contract.title || "[Multiple Items]"}</div>
                <div className="col-md-6">{contract.price} ISK</div>
              </li>
            )
          })}
          </ul>
        </div>
      </div>
    );
  }
}

export default withStyles(ViewContracts, s);
