/*
 * Licensed to Gisaïa under one or more contributor
 * license agreements. See the NOTICE.txt file distributed with
 * this work for additional information regarding copyright
 * ownership. Gisaïa licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { ArlasError } from './error';


export class DashboardError extends ArlasError {

  private hubUrl;

  public constructor(status: number, hubUrl: string) {
    super(status);
    this.hubUrl = hubUrl;
    this.title = marker('Could not access the dashboard');
    this.actionType = 'link';
    if (this.status === 403) {
      this.showAction = !!this.hubUrl;
      this.actionMessage = marker('go to arlas hub');
      this.message = marker('dashboard access forbidden');
    } else if (this.status === 401) {
      this.showAction = !!this.hubUrl;
      this.actionMessage = marker('go to arlas hub');
      this.message = marker('dashboard access not authorized');
    } else if (this.status === 404) {
      this.showAction = !!this.hubUrl;
      this.actionMessage = marker('go to arlas hub');
      this.message = marker('dashboard does not exist');
    } else {
      this.message = marker('The connection to dashbords is lost');
      this.showAction = false;
    }
  }

  public executeAction() {
    this.goToArlasHub();
  }

  private goToArlasHub() {
    if (!!this.hubUrl) {
      window.open(this.hubUrl, '_self');
    }
  }
}

