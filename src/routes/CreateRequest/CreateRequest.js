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
import fuzzy from 'fuzzy';

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

  constructor(props) {
      super(props);

      this.state = {
        selectedItems: [],
        itemSuggestions: [],
        itemCountValid: true,
        itemNameValid: undefined,
        contractTitleValid: undefined
      };
  }

  onValidateTitle() {

    this.setState({
      contractTitleValid: this.refs.title.value.length > 0 && this.refs.title.value.length < 64
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
      itemCountValid: count !== '' && !isNaN(parseInt(count))
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
      itemNameValid: false
    });
  }

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
                <fieldset className={cx("form-group", s.item_name_fieldset, { "has-danger": this.state.contractTitleValid === false, "has-success": this.state.contractTitleValid === true })}>
                  <label className="form-control-label" htmlFor="create-request-title">Title</label>
                  <input onChange={() => { this.onValidateTitle(); }} ref="title" type="text" className={cx("form-control", { "form-control-danger": this.state.contractTitleValid === false, "form-control-success": this.state.contractTitleValid === true })} id="create-request-title" placeholder="" />
                </fieldset>
                <fieldset className="form-group">
                  <label className="form-control-label">Contract Items</label>
                  <div className={s.contract_item_list}>
                  {
                    this.state.selectedItems.length > 0 ?
                      this.state.selectedItems.map((item, i) => {
                        return <div key={i}><li>{item.count} {item.name}<i className="fa fa-times" onClick={() => { this.onRemoveItem(item); }}></i></li></div>;
                      }) :
                      <div>No items selected</div>
                  }
                  </div>
                </fieldset>
                <div className="form-inline">
                  <fieldset className={cx("form-group", s.item_name_fieldset, { "has-danger": this.state.itemNameValid === false, "has-success": this.state.itemNameValid === true })}>
                    <label className="form-control-label" htmlFor="create-request-item">Item Name</label>
                    <input onChange={() => { this.onValidateItemName(); }} ref="item_name" type="text" className={cx("form-control", { "form-control-danger": this.state.itemNameValid === false, "form-control-success": this.state.itemNameValid === true })} id="create-request-item" placeholder="" />
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
                    <input defaultValue="1" onChange={() => { this.onValidateItemCount(); }} ref="item_count" type="number" className={cx("form-control", { "form-control-danger": this.state.itemCountValid === false, "form-control-success": this.state.itemCountValid === true })} id="create-request-itemcount" placeholder="" />
                  </fieldset>
                  <button type="submit" className={cx("btn", s.button_style, { disabled: this.state.itemCountValid === false || this.state.itemNameValid === false || this.state.itemNameValid === undefined || this.state.itemCountValid === false })} onClick={() => { this.addSelectedItem(); }}>ADD</button>
                </div>
                <div className={cx("checkbox", s.form_checkbox)}>
                  <label>
                    <input type="checkbox" id="create-request-corponly" /> Corp Only
                  </label>
                </div>
                <button type="submit" className={cx("btn", s.button_style, { disabled: this.state.contractTitleValid !== true || this.state.selectedItems.length <= 0 })}>SUBMIT</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(CreateRequest, s);
