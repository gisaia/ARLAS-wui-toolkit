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

/** Error sent when the dashboard is invalid */
export class InvalidDashboardError extends ArlasError {
  public constructor(private readonly hubUrl: string) {
    super(0);

    this.title = marker('Dashboard is invalid');
    this.actionType = 'link';
    this.showAction = true;
    this.actionMessage = marker('go to arlas hub');
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
