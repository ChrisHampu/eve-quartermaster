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
import { itemNames } from '../../constants/itemNames';
import fetch, { fetchLocal } from '../../core/fetch';
import fuzzy from 'fuzzy';

class CreateRequest extends Component {

  constructor(props) {
      super(props);

      this.state = {
        selectedItems: [],
        itemSuggestions: [],
        itemCountValid: true,
        itemNameValid: undefined,
        contractTitleValid: undefined,
        submissionResult: undefined,
        itemInputActive: 'manual',
        fittingValid: undefined
      };
  }

  onValidateTitle() {

    this.setState({
      contractTitleValid: this.refs.title.value.length >= 4 && this.refs.title.value.length < 60
    });
  }

  onValidateItemName() {

    if (this.refs.item_name.value.length <= 0) {

      this.setState({
        itemNameValid: false,
        itemSuggestions: []
      });

      return;
    }

    const selectedNames = this.state.selectedItems.map((item) => { return item.name; });

    const matches = fuzzy.filter(this.refs.item_name.value, itemNames).slice(0, 6).filter((match) => {
      return selectedNames.indexOf(match.original) === -1;
    }).map((match) => {
      return match.original;
    });

    this.setState({
      itemNameValid: matches.map((match) => { return match.toLowerCase(); }).indexOf(this.refs.item_name.value.toLowerCase()) !== -1 || matches.length === 1,
      itemSuggestions: matches
    });
  }

  onValidateItemCount() {

    const count = this.refs.item_count.value;

    this.setState({
      itemCountValid: count !== '' && !isNaN(parseInt(count)) && parseInt(count) >= 1 && parseInt(count) <= 1000000
    });
  }

  onRemoveItem(item) {

    this.state.selectedItems.splice(this.state.selectedItems.findIndex((itemObj) => {
      return itemObj.name === item;
    }), 1);

    this.setState({
      selectedItems: this.state.selectedItems
    });
  }

  async onSubmitRequest() {

    if (!this.isSubmissionAllowed()) {
      return;
    }

    const itemString = this.state.selectedItems.map((item) => {
      return `{name:"${item.name}",count:${item.count}}`;
    }).join(',');

    const graphString = `/graphql?query={createRequest(title:"${this.refs.title.value}",count:1,corp_only:${this.refs.corp_only.checked},items:[${itemString}])
                                   {success,message}}`; // eslint-disable-line object-curly-spacing

    let result = null;

    try {
      if (fetchLocal === undefined) {
        const response = await fetch(graphString, { credentials: 'same-origin' });

        const json = await response.json();

        result = json.data.createRequest;
      } else {
        const json = await fetchLocal(graphString, { cookies: [this.state.context.getSession()] });

        result = json.data.createRequest;
      }
    } catch (err) { // eslint-disable-line object-curly-spacing

      this.setState({
        submissionResult: { success: 0, message: "There was an error submitting your request. Refresh the page and try again or contact a Director." }
      });

      return;
    }

    if (result.success === 1) {

      this.setState({
        submissionResult: result,
        selectedItems: [],
        contractTitleValid: undefined
      }, () => {

        this.refs.title.value = "";
      });

    } else {

      this.setState({
        submissionResult: result
      });
    }
  }

  onValidateFitting() {

    const lines = this.refs.fitting.value.split('\n');

    if (!lines.length) {
      return;
    }

    // The first line should be a ship and fitting name
    const header = /^\[(.+), (.+)\]/.exec(lines.shift());

    if (header.length !== 3) {
      return;
    }

    const ship = header[1];

    if (itemNames.indexOf(ship) === -1) {
      return;
    }

    this.addItemToList(ship, 1);

    for (const line of lines) {

      if (!line.length || line[0] === ' ') {
        continue;
      }

      const match = /^(.+) x([0-9]+)|(.+)/.exec(line);

      const count = parseInt(match[2]) || 1;
      const item = match[1] || match[3];

      if (itemNames.indexOf(item) === -1) {
        continue;
      }

      // Group all the items & counts together
      this.addItemToList(item, count);
    }

    this.setState({
      selectedItems: this.state.selectedItems
    }, () => {
      this.refs.fitting.value = "";
    });
  }

  onItemNameKeyDown(ev) {

    if (ev.keyCode === 13) { // Enter key

      this.addSelectedItem();

    } else if (ev.keyCode === 9 && this.refs.item_name.value.length > 0 && this.state.itemSuggestions.length > 0) { // Tab key

      this.refs.item_name.value = this.state.itemSuggestions[0];

      this.setState({
        itemSuggestions: [],
        itemNameValid: true
      });

      ev.preventDefault();
    }
  }

  setItemInput(input) {

    this.setState({
      itemInputActive: input
    });
  }

  selectItemSuggestion(item) {

    this.setState({
      itemSuggestions: [],
      itemNameValid: true
    }, () => {

      this.refs.item_name.value = item;
    });
  }

  addSelectedItem() {

    if (this.state.itemCountValid === false || this.state.itemNameValid === false || this.state.itemCountValid === undefined || this.state.itemNameValid === undefined) {
      return;
    }

    this.state.selectedItems.push({
      name: this.refs.item_name.value,
      count: this.refs.item_count.value
    });

    this.refs.item_name.value = '';

    this.setState({
      selectedItems: this.state.selectedItems,
      itemNameValid: false,
      itemSuggestions: []
    });
  }

  isSubmissionAllowed() {
    return this.state.contractTitleValid === true && this.state.selectedItems.length > 0;
  }

  addItemToList(item, count) {

    const itemCount = count || 1;

    const idx = this.state.selectedItems.findIndex((val) => {
      return val.name === item;
    });

    // If item is already in the array, increment its counter
    if (idx !== -1) {
      this.state.selectedItems[idx].count += itemCount;
    } else {
      this.state.selectedItems.push({ name: item, count: itemCount });
    }
  }

  resetItemList() {

    this.setState({
      selectedItems: []
    });
  }

  render() {
    return (
      <div className={s.root}>
      <Sidebar />
      <div className={s.container}>
        <h4>Create Contract Request</h4>
        <div className="container-fluid">
          <div className={cx("row", s.instructions)}>
            <div className="col-md-12">
            Add each of the the items you want in the contract, give your request a descriptive title, and then submit your request.
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <fieldset className={cx("form-group", { "has-danger": this.state.contractTitleValid === false, "has-success": this.state.contractTitleValid === true })}>
                <label className="form-control-label" htmlFor="create-request-title">Request Title/Description</label>
                <input onChange={() => { this.onValidateTitle(); }} ref="title" type="text" className={cx("form-control", { "form-control-danger": this.state.contractTitleValid === false, "form-control-success": this.state.contractTitleValid === true })} id="create-request-title" placeholder="" />
              </fieldset>
              <div className={cx("btn-group", s.item_input_selector)} role="group">
                <button type="button" onClick={() => { this.setItemInput('manual'); }} data-state={ this.state.itemInputActive === 'manual' ? 'active' : 'inactive' } className="btn btn-secondary">Manual</button>
                <button type="button" onClick={() => { this.setItemInput('eft'); }} data-state={ this.state.itemInputActive === 'eft' ? 'active' : 'inactive' } className="btn btn-secondary">Paste Fitting</button>
              </div>
              {
                this.state.itemInputActive === 'eft' ?
                <div>
                  <fieldset className={cx("form-group", { "has-danger": this.state.fittingValid === false, "has-success": this.state.fittingValid === true })}>
                    <label className="form-control-label" htmlFor="paste-fitting">Paste into text area below</label>
                    <textarea onChange={() => { this.onValidateFitting(); }} ref="fitting" className={cx("form-control", { "form-control-danger": this.state.fittingValid === false, "form-control-success": this.state.fittingValid === true })} id="paste-fitting" />
                  </fieldset>
                  <button type="submit" className={cx("btn", s.button_style)} onClick={() => { this.resetItemList(); }}>RESET ITEMS</button>
                </div>
                :
                <div>
                  <fieldset className={cx("form-group", s.item_name_fieldset, { "has-danger": this.state.itemNameValid === false, "has-success": this.state.itemNameValid === true })}>
                    <label className="form-control-label" htmlFor="create-request-item">Item Name</label>
                    <input onKeyDown={(ev) => { this.onItemNameKeyDown(ev); }} onChange={() => { this.onValidateItemName(); }} ref="item_name" type="text" className={cx("form-control", { "form-control-danger": this.state.itemNameValid === false, "form-control-success": this.state.itemNameValid === true })} id="create-request-item" placeholder="" />
                    {
                      this.state.itemSuggestions.length > 0 ?
                        <div className="dropdown-menu open">
                          {
                            this.state.itemSuggestions.map((item, i) => {
                            return <a key={i} className="dropdown-item" onClick={() => { this.selectItemSuggestion(item); }}>{item}</a>;
                            })
                          }
                        </div> : false
                    }
                  </fieldset>
                  <fieldset className={cx("form-group", { "has-danger": this.state.itemCountValid === false, "has-success": this.state.itemCountValid === true })}>
                    <label className="form-control-label" htmlFor="create-request-itemcount">Amount</label>
                    <input tabIndex="-1" defaultValue="1" min="1" max="1000000" onChange={() => { this.onValidateItemCount(); }} ref="item_count" type="number" className={cx("form-control", { "form-control-danger": this.state.itemCountValid === false, "form-control-success": this.state.itemCountValid === true })} id="create-request-itemcount" placeholder="" />
                  </fieldset>
                  <button type="submit" className={cx("btn", s.button_style, s.add_item_button, { disabled: this.state.itemCountValid === false || this.state.itemNameValid === false || this.state.itemNameValid === undefined || this.state.itemCountValid === false })} onClick={() => { this.addSelectedItem(); }}>ADD ITEM</button>
                  <button type="submit" className={cx("btn", s.button_style)} onClick={() => { this.resetItemList(); }}>RESET ITEMS</button>
                </div>
              }
              <fieldset className={cx("form-group", s.contract_items_fieldset)}>
                <label className="form-control-label">Contract Items</label>
                <div className={cx(s.contract_item_list)}>
                {
                  this.state.selectedItems.length > 0 ?
                    this.state.selectedItems.map((item, i) => {
                      return <div key={i}><li><span>{item.count} {item.name}</span><i className="fa fa-times" onClick={() => { this.onRemoveItem(item.name); }}></i></li></div>;
                    }) :
                    <div>At least one item must be added.<br />You can add items by typing in a name or by pasting a ship fitting.</div>
                }
                </div>
              </fieldset>
              <fieldset className="form-group">
                <div className={cx("checkbox", s.form_checkbox)}>
                  <label>
                    <input ref="corp_only" type="checkbox" id="create-request-corponly" /> Corp Only
                  </label>
                </div>
              </fieldset>
              <fieldset className="form-group">
                <button onClick={() => { this.onSubmitRequest(); }} type="submit" className={cx("btn", s.button_style, { disabled: !this.isSubmissionAllowed() })}>SUBMIT</button>
              </fieldset>
              {
                this.state.submissionResult !== undefined ?
                  <div className={ this.state.submissionResult.success === 0 ? cx(s.submission_error) : cx() }>{this.state.submissionResult.message}</div> : false
              }
            </div>
          </div>
        </div>
      </div>
    </div>
    );
  }
}

export default withStyles(CreateRequest, s);
