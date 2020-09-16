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

import { TestBed, inject } from '@angular/core/testing';

import { ArlasBookmarkService } from './bookmark.service';
import { ArlasCollaborativesearchService, ArlasStartupService, ArlasConfigService } from '../startup/startup.service';
import { MatSnackBarModule } from '@angular/material';
import { ActivatedRoute, Router} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { APP_BASE_HREF } from '@angular/common';
import { ArlasConfigurationUpdaterService } from '../configuration-updater/configurationUpdater.service';
import { of } from 'rxjs';

describe('ArlasBookmarkService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatSnackBarModule, RouterTestingModule, HttpClientModule],
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
        ArlasConfigService
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
