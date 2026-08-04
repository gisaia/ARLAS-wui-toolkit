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

import { marker } from '@colsen1991/ngx-translate-extract-marker';
import { ArlasError } from './error';

/** Error sent when failing to access dashboards */
export class DashboardError extends ArlasError {
  public constructor(status: number, private readonly hubUrl: string) {
    const title = marker('Could not access the dashboard');

    let message: string = marker('The connection to dashbords is lost');
    let actionMessage: string | undefined;
    if (status === 403) {
      actionMessage = marker('go to arlas hub');
      message = marker('dashboard access forbidden');
    } else if (status === 401) {
      actionMessage = marker('go to arlas hub');
      message = marker('dashboard access not authorized');
    } else if (status === 404) {
      actionMessage = marker('go to arlas hub');
      message = marker('dashboard does not exist');
    }

    super(status, title, message);

    this.actionType = 'link';
    this.showAction = !!this.hubUrl;
    this.actionMessage = actionMessage;
  }

  public executeAction() {
    this.goToArlasHub();
  }

  private goToArlasHub() {
    if (this.hubUrl) {
      window.open(this.hubUrl, '_self');
    }
  }
}
