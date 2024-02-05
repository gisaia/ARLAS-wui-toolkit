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

import { AuthorisationError } from './authorisation-error';

export class AuthorisationOnActionError extends AuthorisationError {

  public action: string;
  public constructor(status: number, action: string) {
    super(status);
    if (this.status === 403) {
      this.message = 'access forbidden to ' + action;
    } else if (this.status === 401) {
      this.message = 'access not authorized anymore';
    } else {
      // could never happen because this error should be thrown only for the statuses 401 & 403
      this.message = 'Unknown error';
    }
  }
}

