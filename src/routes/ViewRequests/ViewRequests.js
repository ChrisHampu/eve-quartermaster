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
import s from './ViewRequests.scss';
import cx from 'classnames';
import fuzzy from 'fuzzy';
import { shipNames } from '../../constants/shipNames.js';

class ViewRequests extends Component {

  static contextTypes = {
    getUser: PropTypes.func
  }

  static propTypes = {
    requests: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      initialRequests: this.props.requests, // This is the core set of requests
      requests: this.props.requests, // This is the active (viewable) requests, IE when searching
      searchText: "",
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

  getRequestActions(request) {

    // Find the ships that exist in this request to see if EFT is possible
    const ships = [];

    for (const item of request.items) {

      const idx = shipNames.indexOf(item.name);

      if (idx !== -1) {
        ships.push(shipNames[idx]);
      }
    }

    // Check if user is request creator to see if delete action possible
    const deletionPossible = request.character_name === this.context.getUser().name;

    return (<div className={s.request_actions}>
      {ships.length === 1 ? <div className={cx(s.copy_eft, "btn")} onClick={(ev) => { ev.stopPropagation(); this.copyFitting(request, ships[0]); }}>Copy EFT</div> : false}
      {deletionPossible ? <div className={cx(s.delete_request, "btn")} onClick={(ev) => { ev.stopPropagation(); this.deleteRequest(request); }}>Delete</div> : false}
    </div>);
  }

  filterPredicate(request) {

    if (request === null) {
      return false;
    }

    return true;
  }

  updateRequests() {

    let requests = this.state.initialRequests.filter((request) => this.filterPredicate(request));

    if (requests.length > 0) {

      if (this.state.searchText.length > 0) {
        requests = fuzzy.filter(this.state.searchText, requests, {
          extract: request => { return request.title + request.station; }
        }).map(el => { return el.original; });
      }
    }

    this.setState({ requests: requests });
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

  copyFitting(request, ship) {

    const header = `[${ship}, ${request.title}]`;

    const body = request.items.filter((item) => {
      return item.name !== ship;
    }).map((item) => {
      return item.count > 1 ? `${item.name} x${item.count}` : `${item.name}`;
    });

    this.refs.eft_text.value = `${header}\n${body.join('\n')}`;
    this.refs.eft_text.select();

    document.execCommand('copy');
  }

  async deleteRequest(request) {

    if (!request) {
      return;
    }

    // Query server to remove request
    const graphString = `/graphql?query={deleteRequest(id:${request.id})}`;

    try {
       if (fetch !== undefined) {

        await fetch(graphString);
      }
    } catch (e) { // eslint-disable-line no-empty
    }

    const idx = this.state.initialRequests.findIndex((req) => {
      return request.id === req.id;
    });

    if (idx === -1) {
      return;
    }

    // Remove this request from root array
    this.state.initialRequests.splice(idx, 1);

    this.setState({
      initialRequests: this.state.initialRequests
    }, () => {
      this.updateRequests();
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
                          <div className="col-md-2">{this.getRequestActions(request)}</div>
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
        <textarea ref="eft_text" className={s.eft_textarea} />
      </div>
    );
  }
}

export default withStyles(ViewRequests, s);
