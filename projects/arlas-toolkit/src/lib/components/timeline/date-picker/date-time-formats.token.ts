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

import { inject, InjectionToken } from '@angular/core';
import { OwlDateTimeFormats } from '@danielmoncada/angular-datetime-picker';
import { OwlMomentDateTimeAdapterOptions } from '@danielmoncada/angular-datetime-picker-moment-adapter';

export const DEFAULT_OWL_DATE_TIME_FORMATS_VALUE = {
  parseInput: 'l LT',
  fullPickerInput: 'l LT',
  datePickerInput: 'l',
  timePickerInput: 'LT',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY'
};

export const DEFAULT_OWL_DATE_TIME_FORMATS = new InjectionToken<OwlDateTimeFormats>(
  'DEFAULT_OWL_DATE_TIME_FORMATS',
  {
    factory: () => (DEFAULT_OWL_DATE_TIME_FORMATS_VALUE)
  }
);

export const ARLAS_DATE_TIME_FORMATS = new InjectionToken<OwlDateTimeFormats>(
  'ARLAS_DATE_TIME_FORMATS',
  {
    factory: () => inject(DEFAULT_OWL_DATE_TIME_FORMATS)
  }
);

export const ARLAS_OWL_MOMENT_ADAPTER_OPTIONS_OVERRIDE =
  new InjectionToken<Partial<OwlMomentDateTimeAdapterOptions>>(
    'ARLAS_OWL_MOMENT_ADAPTER_OPTIONS_OVERRIDE',
    {
      providedIn: 'root',
      factory: () => ({})
    }
  );

export const ARLAS_OWL_MOMENT_ADAPTER_OPTIONS =
  new InjectionToken<OwlMomentDateTimeAdapterOptions>(
    'ARLAS_OWL_MOMENT_ADAPTER_OPTIONS',
    {
      providedIn: 'root',
      factory: () => {
        const override = inject(ARLAS_OWL_MOMENT_ADAPTER_OPTIONS_OVERRIDE);

        return {
          useUtc: false,
          parseStrict: false,
          ...override
        };
      }
    }
  );
