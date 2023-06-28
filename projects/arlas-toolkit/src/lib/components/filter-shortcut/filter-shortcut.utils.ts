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

import { WidgetConfiguration } from '../../tools/utils';
import { numberToShortValue } from 'arlas-web-components';
import { Contributor } from 'arlas-web-core';

export interface FilterShortcutConfiguration {
  uuid: string;
  title: string;
  order: 1;
  component?: WidgetConfiguration;
}

export function numberToShortString(value: number, precision=2) {
  // Handle case not present for numberToShortValue
  if (Math.abs(value) < 1000) {
    if (Math.round(value) === value) {
      return value.toFixed(0);
    }
    return value.toFixed(precision);
  }

  return numberToShortValue(value, precision);
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isShortcutID(id: string): boolean {
  return id.match(UUID_REGEX).length !== 0;
}
