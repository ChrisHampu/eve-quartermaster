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
import s from './ViewRequests.scss';
import cx from 'classnames';
import fuzzy from 'fuzzy';

class ViewRequests extends Component {

  static propTypes = {
    requests: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      requests: this.props.requests,
      searchText: undefined,
      activeRequest: null
    };
  }

  onSearchChange(ev) {

    this.setState({
      searchText: ev.target.value
    }, () => {
      this.updateRequests();
    });
  }

  filterPredicate(request) {

    if (request === null) {
      return false;
    }

    return true;
  }

  updateRequests() {

    let requests = this.props.requests.filter((request) => this.filterPredicate(request));

    if (requests.length > 0) {

      if (this.state.searchText.length > 0) {
        requests = fuzzy.filter(this.state.searchText, requests, {
          extract: request => { return request.title + request.station; }
        }).map(el => { return el.original; });
      }
    }

    this.setState({ requests: requests, activeRequest: requests[0] });
  }

  prettyExpireTime(request) {

    var d;
    var h;
    var m;
    var sec;
    const expiry = new Date(request.expires); // eslint-disable-line prefer-template

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

  toggleActiveRequest(request) {

    if (this.state.activeRequest !== null && this.state.activeRequest === request) {

      this.setState({
        activeRequest: null,
      });

      return;
    }

    this.setState({
      activeRequest: request,
    });
  }

  render() {
    return (
      <div className={s.root}>
        <Sidebar />
        <div className={s.container}>
          <div className={cx("form-group has-feedback", s.request_search)}>
            <input type="search" placeholder="Search requests" className={cx("form-control")} onChange={(ev) => { this.onSearchChange(ev); }} />
            <span className="form-control-feedback"><i className="fa fa-search"></i></span>
          </div>
          { this.state.requests.length > 0 ?
            <div>
              <h4>Contract Requests</h4>
              <div className={s.request_count}>Showing { this.state.requests.length } requests</div>
              <div className={cx("row", s.request_container)}>
                <div className="col-md-12">
                  <div className={cx("row", s.request_header)}>
                    <div className="col-md-2">
                      Title
                    </div>
                    <div className="col-md-2">
                      Issuer
                    </div>
                    <div className="col-md-2">
                      Fulfilled
                    </div>
                    <div className="col-md-2">
                      Location
                    </div>
                    <div className="col-md-2">
                      Expires
                    </div>
                    <div className="col-md-2">
                      Actions
                    </div>
                  </div>
                  <div className="row">
                    <ul className={cx("col-md-12", s.request_list)}>
                    { this.state.requests.map((request, i) => {
                      return (
                        <li key={i} className={this.state.activeRequest === request ? cx("row", s.request_list_active) : cx("row")} onClick={() => { this.toggleActiveRequest(request); }}>
                          <div className="col-md-2">{request.title}</div>
                          <div className="col-md-2">{request.character_name}</div>
                          <div className="col-md-2">{request.status}</div>
                          <div className="col-md-2">{request.station}</div>
                          <div className="col-md-2">{this.prettyExpireTime(request)}</div>
                          <div className="col-md-2">N/A</div>
                        </li>
                      );
                    })}
                    </ul>
                  </div>
                  <div style={this.state.activeRequest === null ? {} : { transform: 'translateX(0%)' }} className={s.request_item_container}>
                  { this.state.activeRequest !== null ?
                      <div>
                      { this.state.activeRequest.items !== undefined ?
                        <div className={s.request_item_list}>
                          <h5>Requested Items</h5>
                          <div className={cx("row", s.request_item_header)}>
                            <div className="col-md-4">Quantity</div>
                            <div className="col-md-8">Name</div>
                          </div>
                          <div className={cx("row", s.request_items)}>
                          {
                            this.state.activeRequest.items.length > 0 ?
                              this.state.activeRequest.items.map((item, i) => {
                                return <div key={i} className="row col-md-12"><div className="col-md-3"><span>{item.count}</span></div><div className="col-md-9">{item.name}</div></div>;
                              })
                              :
                              <div>Failed to fetch items or none available</div>
                          }
                          </div>
                        </div> : <div><div className={s.request_item_list}><h5>Requested Items</h5><div>Loading items..</div></div></div>
                      }
                      </div>
                    : false
                  }
                </div>
                </div>
              </div>
            </div>
            :
            <h4>There are currently no requests</h4>
          }
        </div>
      </div>
    );
  }
}

export default withStyles(ViewRequests, s);
