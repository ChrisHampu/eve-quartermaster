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
import Sidebar from '../../components/Sidebar';
import s from './ViewContracts.scss';
import cx from 'classnames';
import fetch from '../../core/fetch';
import fuzzy from 'fuzzy';

class ViewContracts extends Component {

  static contextTypes = {
    getSession: PropTypes.func
  }

  constructor(props) {
    super(props);

    this.toggleShowStatus = this.toggleShowStatus.bind(this);
    this.toggleSetSortBy = this.toggleSetSortBy.bind(this);

    this.state = {
      initialContracts: null,
      contracts: [],
      activeContract: null,
      searchText: '',
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
        Auction: false,
      },
      sortBy: 'title',
      sortByParams: {
        title: {
          ascending: true,
          variable: 'title',
          type: 'string',
        },
        price: {
          ascending: true,
          variable: 'price',
          type: 'number',
        },
        expires: {
          ascending: true,
          variable: 'dateExpired',
          type: 'string',
        },
        location: {
          ascending: true,
          variable: 'stationName',
          type: 'string',
        },
        type: {
          ascending: true,
          variable: 'type',
          type: 'string',
        }
      }
    };
  }

  componentWillMount() {

  }

  async componentDidMount() {

    let data = null;

    const response = await fetch(`/graphql?query={contracts{contractList{id,issuerID,issuerCorpID,assigneeID,stationName,startStationID,endStationID,type,status,
                                 title,forCorp,public,dateIssued,dateExpired,dateAccepted,numDays,dateCompleted,price,reward,collateral,buyout,volume}}}`, { headers: { Authorization: this.context.getSession() } });

    const json = await response.json();

    data = json.data;

    let contractList = [];

    if (data && data.contracts) {
      contractList = data.contracts.contractList || [];
    }

    this.state.initialContracts = contractList;

    this.updateContracts();
  }

  onSearchChange(ev) {

    this.setState({
      searchText: ev.target.value
    }, () => {
      this.updateContracts();
    });
  }

  // TODO: Verify whether async functions are required to return a value
  async getContractItems(contract) { // eslint-disable-line consistent-return

    if (this.state.activeContract.items !== undefined) {
      return this.state.activeContract.items;
    }

    let items = [];

    try {

      const response = await fetch(`/graphql?query={contractItems(id:${contract.id})
                                 {itemList{id,quantity,typeID,typeName}}}`, { headers: { Authorization: this.context.getSession() } }); // eslint-disable-line object-curly-spacing

      const json = await response.json();

      items = json.data.contractItems.itemList;

    } catch (err) { // eslint-disable-line no-empty
    }

    if (this.state.activeContract !== null) {
      this.state.activeContract.items = items;
    }

    this.setState({
      activeContract: this.state.activeContract
    });
  }

  toggleSetSortBy(sort) {

    if (this.state.sortBy === sort) {
      this.toggleSortDirection(sort);
      return;
    }

    this.setState({ sortBy: sort }, () => {
      this.updateContracts();
    });
  }

  toggleSortDirection() {

    const ascending = !this.state.sortByParams[this.state.sortBy].ascending;
    this.state.sortByParams[this.state.sortBy].ascending = ascending;

    this.setState({
      sortByParams: this.state.sortByParams,
    }, () => {
      this.updateContracts();
    });
  }

  toggleActiveContract(contract) {

    if (this.state.activeContract !== null && this.state.activeContract.id === contract.id) {

      this.setState({
        activeContract: null,
      });

      return;
    }

    this.setState({
      activeContract: contract,
    }, () => {

      this.getContractItems(this.state.activeContract);
    });
  }

  // Functor used to iterate and filter out contracts based on current state
  filterPredicate(contract) {

    if (contract === null) {
      return false;
    }

    return this.state.showStatus[contract.status] === true &&
      this.state.showType[contract.type] === true;
  }

  toggleShowStatus(status) {

    const show = this.state.showStatus;
    show[status] = !this.state.showStatus[status];

    this.setState({ showStatus: show }, () => {

      this.updateContracts();
    });
  }

  componendDidMount() {
  }

  sortPredicateString(a, b) {

    const one = a[this.state.sortByParams[this.state.sortBy].variable].toLowerCase();
    const two = b[this.state.sortByParams[this.state.sortBy].variable].toLowerCase();

    if (one > two) {
      return this.state.sortByParams[this.state.sortBy].ascending === true ? 1 : -1;
    } else if (one < two) {
      return this.state.sortByParams[this.state.sortBy].ascending === true ? -1 : 1;
    }

    return 0;
  }

  sortPredicateNumber(a, b) {

    const one = a[this.state.sortByParams[this.state.sortBy].variable];
    const two = b[this.state.sortByParams[this.state.sortBy].variable];

    if (one > two) {
      return this.state.sortByParams[this.state.sortBy].ascending === true ? 1 : -1;
    } else if (one < two) {
      return this.state.sortByParams[this.state.sortBy].ascending === true ? -1 : 1;
    }

    return 0;
  }

  updateContracts() {

    let contracts = this.state.initialContracts.filter((contract) => this.filterPredicate(contract));

    if (contracts.length > 0) {

      if (this.state.searchText.length > 0) {
        contracts = fuzzy.filter(this.state.searchText, contracts, {
          extract: contract => { return contract.title + contract.stationName; }
        }).map(el => { return el.original; });
      }

      if (this.state.sortByParams[this.state.sortBy].type === 'number') {
        contracts = contracts.sort((a, b) => this.sortPredicateNumber(a, b));
      } else {
        contracts = contracts.sort((a, b) => this.sortPredicateString(a, b));
      }
    }

    this.setState({ contracts: contracts });
  }

  prettyExpireTime(contract) {

    var d;
    var h;
    var m;
    var sec;
    // const expiry = Date.parse(contract.dateExpired + ' UTC'); // eslint-disable-line prefer-template
    const expiry = Date.parse(contract.dateExpired); // eslint-disable-line prefer-template

    if (new Date(Date.now()) > expiry) {
      return 'Expired';
    }

    const ms = expiry - Date.now();

    sec = Math.floor(ms / 1000);
    m = Math.floor(sec / 60);
    sec = sec % 60;
    h = Math.floor(m / 60);
    m = m % 60;
    d = Math.floor(h / 24);
    h = h % 24;

    return (d > 0 ? d + ' days ' : '') + (h > 0 ? h + ' hours ' : '') + 'left'; // eslint-disable-line prefer-template
  }

  prettyContractStatus(contract) {

    switch (contract.status) {
      case "InProgress": return "In Progress";
      default: return contract.status;
    }
  }

  prettyContractType(contract) {

    switch (contract.type) {
      case "ItemExchange": return "Item Exchange";
      default: return contract.type;
    }
  }

  render() {

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
                  <input type="checkbox" readOnly="true" checked={this.state.showStatus.Outstanding} onClick={() => { this.toggleShowStatus("Outstanding"); }} />
                  Outstanding
                </label>
              </div>
            </li>
            <li className="nav-item">
              <div className="checkbox">
                <label className={s.nav_label}>
                  <input type="checkbox" readOnly="true" checked={this.state.showStatus.InProgress} onClick={() => { this.toggleShowStatus("InProgress"); }} />
                  In Progress
                </label>
              </div>
            </li>
            <li className="nav-item">
              <div className="checkbox">
                <label className={s.nav_label}>
                  <input type="checkbox" readOnly="true" checked={this.state.showStatus.Completed} onClick={() => { this.toggleShowStatus("Completed"); }} />
                  Completed
                </label>
              </div>
            </li>
            <li className="nav-item">
              <div className="checkbox">
                <label className={s.nav_label}>
                  <input type="checkbox" readOnly="true" checked={this.state.showStatus.Deleted} onClick={() => { this.toggleShowStatus("Deleted"); }} />
                  Deleted
                </label>
              </div>
            </li>
          </ul>
        </Sidebar>
        <div className={s.container}>
          <div className={cx("form-group has-feedback", s.contract_search)}>
            <input type="search" placeholder="Search contracts" className={cx("form-control")} onChange={(ev) => { this.onSearchChange(ev); }} />
            <span className="form-control-feedback"><i className="fa fa-search"></i></span>
          </div>
          {
            this.state.initialContracts ?
            <div>
            {
              this.state.contracts.length > 0 ?
              <div>
                <h4>Contracts</h4>
                <div className={s.contract_count}>Showing { this.state.contracts.length } contracts</div>
                <div className="row">
                  <div className={cx(s.contract_container, "col-md-12 col-sm-12")}>
                    <div className={cx("row", s.contract_header)}>
                      <div className="col-md-2 col-sm-2 col-xs-2" onClick={() => this.toggleSetSortBy('title')}>
                        Title
                        <i className={cx("fa", { "fa-sort-asc": this.state.sortByParams.title.ascending && this.state.sortBy === 'title', "fa-sort-desc": !this.state.sortByParams.title.ascending && this.state.sortBy === 'title' })}></i>
                      </div>
                      <div className="col-md-2 col-sm-2 col-xs-2">
                        Status
                      </div>
                      <div className="col-md-2 col-sm-2 col-xs-2" onClick={() => this.toggleSetSortBy('type')}>
                        Type
                        <i className={cx("fa", { "fa-sort-asc": this.state.sortByParams.type.ascending && this.state.sortBy === 'type', "fa-sort-desc": !this.state.sortByParams.type.ascending && this.state.sortBy === 'type' })}></i>
                      </div>
                      <div className="col-md-2 col-sm-2 col-xs-2" onClick={() => this.toggleSetSortBy('price')}>
                        Price
                        <i className={cx("fa", { "fa-sort-asc": this.state.sortByParams.price.ascending && this.state.sortBy === 'price', "fa-sort-desc": !this.state.sortByParams.price.ascending && this.state.sortBy === 'price' })}></i>
                      </div>
                      <div className="col-md-2 col-sm-2 col-xs-2" onClick={() => this.toggleSetSortBy('location')}>
                        Location
                        <i className={cx("fa", { "fa-sort-asc": this.state.sortByParams.location.ascending && this.state.sortBy === 'location', "fa-sort-desc": !this.state.sortByParams.location.ascending && this.state.sortBy === 'location' })}></i>
                      </div>
                      <div className="col-md-2 col-sm-2 col-xs-2" onClick={() => this.toggleSetSortBy('expires')}>
                        Expires
                        <i className={cx("fa", { "fa-sort-asc": this.state.sortByParams.expires.ascending && this.state.sortBy === 'expires', "fa-sort-desc": !this.state.sortByParams.expires.ascending && this.state.sortBy === 'expires' })}></i>
                      </div>
                    </div>
                    <ul className={cx(s.contract_list)}>
                    { this.state.contracts.map((contract) => {
                      return (
                        <li key={contract.id} className={this.state.activeContract === contract ? cx("row", s.contract_list_active) : cx("row")} onClick={() => { this.toggleActiveContract(contract); }}>
                          <div className="col-md-2 col-sm-2 col-xs-2">{contract.title || "[Multiple Items]"}</div>
                          <div className="col-md-2 col-sm-2 col-xs-2">{contract.status}</div>
                          <div className="col-md-2 col-sm-2 col-xs-2">{this.prettyContractType(contract)}</div>
                          <div className="col-md-2 col-sm-2 col-xs-2">{contract.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ISK</div>
                          <div className="col-md-2 col-sm-2 col-xs-2">{contract.stationName}</div>
                          <div className="col-md-2 col-sm-2 col-xs-2">{this.prettyExpireTime(contract)}</div>
                        </li>
                      );
                    })}
                    </ul>
                  </div>
                  <div style={this.state.activeContract === null ? {} : { transform: 'translateX(0%)' }} className={s.contract_item_container}>
                    { this.state.activeContract !== null ?
                        <div>
                        { this.state.activeContract.items !== undefined ?
                          <div className={s.contract_item_list}>
                            <h5>Contract Items</h5>
                            <div className={cx("row", s.contract_item_header)}>
                              <div className="col-md-4 col-sm-4 col-xs-4">Quantity</div>
                              <div className="col-md-8 col-sm-8 col-xs-8">Name</div>
                            </div>
                            <div className={cx("row", s.contract_items)}>
                            {
                              this.state.activeContract.items.length > 0 ?
                                this.state.activeContract.items.map((item) => {
                                  return <div key={item.id} className="row col-md-12 col-sm-12 col-xs-12"><div className="col-md-3 col-sm-3 col-xs-3"><span>{item.quantity}</span></div><div className="col-md-9 col-sm-9 col-xs-9">{item.typeName}</div></div>;
                                })
                                :
                                <div>Failed to fetch items or none available</div>
                            }
                            </div>
                          </div> : <div><div className={s.contract_item_list}><h5>Contract Items</h5><div>Loading items..</div></div></div>
                        }
                        </div>
                      : false
                    }
                  </div>
                </div>
              </div>
              : <h4>No contracts match criteria</h4>
            }
            </div>
            :
            <h4>Loading contracts</h4>
          }
        </div>
      </div>
    );
  }
}

export default withStyles(s)(ViewContracts);
