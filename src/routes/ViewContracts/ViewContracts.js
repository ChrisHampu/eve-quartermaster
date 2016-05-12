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
import fetch from '../../core/fetch';

class ViewContracts extends Component {

  static propTypes = {
    contracts: PropTypes.array.isRequired 
  };

  constructor(props) {
    super(props);

    this.toggleShowStatus = this.toggleShowStatus.bind(this);
    this.toggleSetSortBy = this.toggleSetSortBy.bind(this);

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
      sortBy: 'title',
      sortByParams: {
        title: {
          ascending: true,
          variable: 'title',
          type: 'string'
        },
        price: {
          ascending: true,
          variable: 'price',
          type: 'number'
        },
        expires: {
          ascending: true,
          variable: 'dateExpired',
          type: 'string'
        },
        location: {
          ascending: true,
          variable: 'stationName',
          type: 'string'
        },
        type: {
          ascending: true,
          variable: 'type',
          type: 'string'
        }
      }
    }
  }

  componentWillMount() {

    this.updateContracts();
  }

  componendDidMount() {
  }

  toggleShowStatus(status) {

    let show = this.state.showStatus;
    show[status] = !this.state.showStatus[status];

    this.setState({ showStatus: show }, () => {

      this.updateContracts();
    });
  }

  toggleSetSortBy(sort) {

    if(this.state.sortBy === sort)
      return;

    this.setState({ sortBy: sort }, () => {

      this.updateContracts();
    });
  }

  // Functor used to iterate and filter out contracts based on current state
  filterPredicate(contract) {

    if(contract === null)
      return false;

    return this.state.showStatus[contract.status] === true &&
      this.state.showType[contract.type] === true;
  }

  sortPredicateString(a, b) {

    let one = a[this.state.sortByParams[this.state.sortBy].variable].toLowerCase();
    let two = b[this.state.sortByParams[this.state.sortBy].variable].toLowerCase();

    if(one > two)
      return this.state.sortByParams[this.state.sortBy].ascending === true ? 1 : -1;
    else if(one < two)
      return this.state.sortByParams[this.state.sortBy].ascending === true? -1 : 1;
    return 0;
  }

  sortPredicateNumber(a, b) {

    let one = a[this.state.sortByParams[this.state.sortBy].variable];
    let two = b[this.state.sortByParams[this.state.sortBy].variable];

    if(one > two)
      return this.state.sortByParams[this.state.sortBy].ascending === true ? 1 : -1;
    else if(one < two)
      return this.state.sortByParams[this.state.sortBy].ascending === true? -1 : 1;
    return 0;
  }

  updateContracts() {

    let contracts = this.props.contracts.filter((contract) => this.filterPredicate(contract));

    if(contracts.length > 0) {

      if(this.state.sortByParams[this.state.sortBy].type === 'number') {
        contracts = contracts.sort((a, b) => this.sortPredicateNumber(a, b));
      } else {
        contracts = contracts.sort((a, b) => this.sortPredicateString(a, b));
      }
    }

    this.setState({ contracts: contracts });
  }

  prettyExpireTime(contract) {

    let issued = Date.parse(contract.dateIssued + " UTC");
    let expiry = Date.parse(contract.dateExpired + " UTC");

    if (new Date(Date.now()) > expiry) {
      return "Expired";
    }

    let ms = expiry - Date.now();

    var d, h, m, s;
    s = Math.floor(ms / 1000);
    m = Math.floor(s / 60);
    s = s % 60;
    h = Math.floor(m / 60);
    m = m % 60;
    d = Math.floor(h / 24);
    h = h % 24;

    return (d > 0 ? d + " days " : "") + (h > 0 ? h + " hours " : "") + "left";
  }

  prettyContractType(contract) {

    switch(contract.type) {
      case "ItemExchange": return "Item Exchange";
    }

    return contract.type;
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
                  <input type="checkbox" className={s.nav_checkbox} readOnly="true" checked={this.state.showStatus.Outstanding} onClick={()=>{ this.toggleShowStatus("Outstanding"); }}/>
                  Outstanding
                </label>
              </div>
            </li>
            <li className="nav-item">
              <div className="checkbox">
                <label className={s.nav_label}>
                  <input type="checkbox" className={s.nav_checkbox} readOnly="true" checked={this.state.showStatus.InProgress} onClick={()=>{ this.toggleShowStatus("InProgress"); }}/>
                  In Progress
                </label>
              </div>
            </li>
            <li className="nav-item">
              <div className="checkbox">
                <label className={s.nav_label}>
                  <input type="checkbox" className={s.nav_checkbox} readOnly="true" checked={this.state.showStatus.Completed} onClick={()=>{ this.toggleShowStatus("Completed"); }}/>
                  Completed
                </label>
              </div>
            </li>
            <li className="nav-item">
              <div className="checkbox">
                <label className={s.nav_label}>
                  <input type="checkbox" className={s.nav_checkbox} readOnly="true" checked={this.state.showStatus.Deleted} onClick={()=>{ this.toggleShowStatus("Deleted"); }}/>
                  Deleted
                </label>
              </div>
            </li>
          </ul>
        </Sidebar>
        <div className={s.container}>
          { this.state.contracts.length > 0 ?
            <div>
            <h4>Contracts</h4>
            <div className={cx("row", s.contract_header)}>
              <div className="col-md-3" onClick={()=> this.toggleSetSortBy('title')}>Title</div>
              <div className="col-md-2" onClick={()=> this.toggleSetSortBy('type')}>Type</div>
              <div className="col-md-3" onClick={()=> this.toggleSetSortBy('price')}>Price</div>
              <div className="col-md-2" onClick={()=> this.toggleSetSortBy('location')}>Location</div>
              <div className="col-md-2" onClick={()=> this.toggleSetSortBy('expires')}>Expires</div>
            </div>
            <ul className={cx(s.contract_list)}>
            { this.state.contracts.map((contract) => {
              return(
                <li key={contract.id} className="row">
                  <div className="col-md-3">{contract.title || "[Multiple Items]"}</div>
                  <div className="col-md-2">{this.prettyContractType(contract)}</div>
                  <div className="col-md-3">{contract.price.toLocaleString()} ISK</div>
                  <div className="col-md-2">{contract.stationName}</div>
                  <div className="col-md-2">{this.prettyExpireTime(contract)}</div>
                </li>
              )
            })}</ul></div>
            : <h4>No contracts match criteria</h4>
          }
        </div>
      </div>
    );
  }
}

export default withStyles(ViewContracts, s);
