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

/** Error sent when the user lacks authorization to view something */
export class AuthorisationError extends ArlasError {
  public constructor(status: number) {
    const title = marker('Could not access the service');

    let message: string = marker('Unknown error');
    let showAction = false;
    if (status === 403) {
      message = marker('acces forbidden');
    } else if (status === 401) {
      message = marker('access not authorized');
      showAction = true;
    }

    super(status, title, message);
    this.showAction = showAction;
    this.actionMessage = marker('Log in');

    if (this.showAction) {
      this.actionType = 'button';
    }
  }

  public executeAction() {
    this.actionSeekerSource.next('login');
  }
}
