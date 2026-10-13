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


export class BackendError extends ArlasError {
  public constructor(
    status: number,
    message: string,
    private readonly hubUrl?: string,
    public service?: string
  ) {
    const title = marker('ARLAS encountered an error');

    let showAction = false;
    if (status === 400 || status === 404) {
      showAction = true;
    } else if (status === 502) {
      message = marker('The connection is lost');
    } else if (status === 503) {
      message = marker('The service is unavailable');
    } else {
      message = marker('An error occured in the service');
    }

    super(status, title, message);
    this.showAction = showAction && !!hubUrl;

    if (this.showAction) {
      this.actionMessage = marker('go to arlas hub');
      this.actionType = 'link';
    }
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
