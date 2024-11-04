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
  private service: string = marker('ARLAS backend services');
  private hubUrl: string;

  public constructor(status: number, message: string, hubUrl: string, service?: string) {
    super(status);
    if (service && service !== '') {
      this.service = service;
    }
    this.hubUrl = hubUrl;
    this.title = marker('ARLAS encountered an error');
    if (this.status === 404) {
      this.message = message;
      this.showAction = true;
      this.actionMessage = marker('go to arlas hub');
      this.actionType = 'link';
    } else if (this.status === 400) {
      this.message = message;
      this.showAction = true;
      this.actionMessage = marker('go to arlas hub');
      this.actionType = 'link';
    } else if (this.status === 502) {
      this.message = marker('The connection is lost');
      this.showAction = false;
    } else if (this.status === 503) {
      this.message = marker('The service is unavailable');
      this.showAction = false;
    } else {
      this.message = marker('An error occured in the service');
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
