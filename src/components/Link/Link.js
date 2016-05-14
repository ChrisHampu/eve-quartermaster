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
import Location from '../../core/Location';
import classNames from 'classnames/bind';
import s from './Link.scss';

function isLeftClickEvent(event) {
  return event.button === 0;
}

function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

class Link extends Component { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    onClick: PropTypes.func,
    path: PropTypes.string,
    activeClass: PropTypes.string,
    useButtonStyle: PropTypes.bool,
    className: PropTypes.string,
  };

  handleClick = (event) => {
    let allowTransition = true;

    if (this.props.onClick) {
      this.props.onClick(event);
    }

    if (isModifiedEvent(event) || !isLeftClickEvent(event)) {
      return;
    }

    if (event.defaultPrevented === true) {
      allowTransition = false;
    }

    event.preventDefault();

    if (allowTransition) {
      if (this.props.to) {
        Location.push(this.props.to);
      } else {
        Location.push({
          pathname: event.currentTarget.pathname,
          search: event.currentTarget.search,
        });
      }
    }
  };

  render() {
    const { to, ...props } = this.props; // eslint-disable-line no-use-before-define

    var cx = classNames.bind({
      active: this.props.activeClass,
      buttonStyle: s.button_style
    });

    var linkClass = cx(this.props.className, {
      active: to === this.props.path && this.props.activeClass,
      buttonStyle: this.props.useButtonStyle || false
    });

    return <a href={Location.createHref(to)} {...props} className={linkClass} onClick={this.handleClick} />;
  }

}

export default withStyles(Link, s);
