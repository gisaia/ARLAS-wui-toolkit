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

import { APP_BASE_HREF } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { inject, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { ArlasCollaborativesearchService } from '../collaborative-search/arlas.collaborative-search.service';
import { ArlasConfigurationUpdaterService } from '../configuration-updater/configurationUpdater.service';
import { ArlasConfigService, ArlasStartupService } from '../startup/startup.service';
import { ArlasBookmarkService } from './bookmark.service';

describe('ArlasBookmarkService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatSnackBarModule, RouterModule.forRoot([])],
      providers: [
        ArlasBookmarkService,
        {
          provide: ArlasStartupService,
          useClass: ArlasStartupService,
          deps: [ArlasConfigurationUpdaterService]
        },
        {
          provide: ArlasConfigurationUpdaterService,
          useClass: ArlasConfigurationUpdaterService
        },
        ArlasCollaborativesearchService, { provide: APP_BASE_HREF, useValue: '/' },
        ArlasConfigService,
        provideHttpClient(withInterceptorsFromDi())
      ]
    });
  });

  it('should be created', inject([ArlasConfigService],
    (arlasConfigService: ArlasConfigService) => {
      const arlasStartupService = TestBed.get(ArlasStartupService);
      arlasStartupService.arlasIsUp.subscribe(isUp => {
        if (isUp) {
          const service: ArlasBookmarkService = TestBed.get(ArlasBookmarkService);
          expect(service).toBeTruthy();
          expect(arlasConfigService).toBeTruthy();
        }

      });
    }));
});
