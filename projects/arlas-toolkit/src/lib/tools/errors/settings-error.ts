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

/** Error sent when the settings.yaml file is invalid */
export class SettingsError extends ArlasError {
  public constructor() {
    super(0);
    this.title = marker('ARLAS Front-end Settings error');
    this.showAction = false;
    this.actionMessage = '';
    this.message = marker('Please check if the settings.yaml file is provided and has a valid syntax');
  }

  public executeAction() {
    return;
  }
}
