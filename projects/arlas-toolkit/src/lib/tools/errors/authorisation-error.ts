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


export class AuthorisationError extends ArlasError {
  public constructor(status: number) {
    super(status);
    this.title = marker('Could not access the service');
    if (this.status === 403) {
      this.showAction = false;
      this.actionMessage = '';
      this.message = marker('acces forbidden');
    } else if (this.status === 401) {
      this.message = marker('access not authorized');
      this.actionType = 'button';
      this.showAction = true;
      this.actionMessage = 'login';
    } else {
      // could never happen because this error should be thrown only for the statuses 401 & 403
      this.message = marker('Unknown error');
      this.showAction = false;
    }
  }

  public executeAction() {
    this.actionSeekerSource.next('login');
  }

}

