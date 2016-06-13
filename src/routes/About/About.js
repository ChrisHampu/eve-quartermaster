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

import React, { Component } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Sidebar from '../../components/Sidebar';
import s from './About.scss';

class About extends Component {

  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    return (
      <div className={s.root}>
        <Sidebar />
        <div className={s.container}>
          <div className={s.section}>
            <h4>About EVE Quartermaster</h4>
            <div className={s.content}>
            The purpose of EVE Quartermaster is to give corporations the ability to oversee
             contracts from outside the game, effectively allowing the corporation to take inventory
             of what contracts are available. Members can create requests for contracts which
             aren't seeded, and upon the contracts being made available, the requests are automatically
             marked as fulfilled.
            </div>
          </div>
          <div className={s.section}>
            <h4>Contact</h4>
            <div className={s.content}>
              For any issues, comments, requests, or other inquiries, contact requests can be directed to the character listed below via EVE-Mail.
              <div className={s.contact_name}>
              EVE-Mail: <span>Maxim Pollard</span>
              </div>
            </div>
          </div>
          <div className={s.section}>
            <h4>Legal</h4>
            <div className={s.content}>
            EVE Online and the EVE logo are the registered trademarks of CCP hf. All rights are reserved worldwide. All other trademarks are
            the property of their respective owners. EVE Online, the EVE logo, EVE and all associated logos and designs are the intellectual
            property of CCP hf. All artwork, screenshots, characters, vehicles, storylines, world facts or other recognizable features of
            the intellectual property relating to these trademarks are likewise the intellectual property of CCP hf. CCP hf. has granted
            permission to EVE Quartermaster to use EVE Online and all associated logos and designs for promotional and information purposes on its
            website but does not endorse, and is not in any way affiliated with, EVE Quartermaster. CCP is in no way responsible for the content
            on or functioning of this website, nor can it be liable for any damage arising from the use of this website.
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(About);
