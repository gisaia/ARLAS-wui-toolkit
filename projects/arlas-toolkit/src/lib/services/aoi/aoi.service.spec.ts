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

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService, TranslateStore
} from '@ngx-translate/core';
import { ArlasCollaborativesearchService } from '../collaborative-search/arlas.collaborative-search.service';
import { ArlasConfigurationUpdaterService } from '../configuration-updater/configurationUpdater.service';
import {
  ArlasConfigService,
  ArlasStartupService,
  CONFIG_UPDATER,
  FETCH_OPTIONS
} from '../startup/startup.service';
import { ArlasAoiService } from './aoi.service';

describe('ArlasAoiService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateFakeLoader } })],
    providers: [
      {
        provide: ArlasStartupService,
        useClass: ArlasStartupService,
        deps: [ArlasConfigurationUpdaterService]
      },
      ArlasConfigService, TranslateService, TranslateStore,
      ArlasCollaborativesearchService,
      { provide: CONFIG_UPDATER, useValue: {} },
      {
        provide: ArlasConfigurationUpdaterService,
        useClass: ArlasConfigurationUpdaterService
      },
      { provide: FETCH_OPTIONS, useValue: {} },
      provideHttpClient(withInterceptorsFromDi()),
    ]
  }));

  it('should be created', () => {
    const service: ArlasAoiService = TestBed.get(ArlasAoiService);
    expect(service).toBeTruthy();
  });
});
