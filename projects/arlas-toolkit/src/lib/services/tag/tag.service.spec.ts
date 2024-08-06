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
import {  HttpClientModule } from '@angular/common/http';
import { TestBed, inject } from '@angular/core/testing';
import { ArlasTagService } from './tag.service';
import { GET_OPTIONS } from '../../tools/utils';
import { getOptionsFactory } from '../../toolkit.module';
import { AuthentificationService } from '../authentification/authentification.service';
import { DateTimeProvider, OAuthLogger, OAuthModule, OAuthService, UrlHelperService } from 'angular-oauth2-oidc';
import { ArlasSettingsService } from '../settings/arlas.settings.service';
import { ArlasCollaborativesearchService } from '../startup/startup.service';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';

describe('ArlasTagService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, OAuthModule, MatSnackBarModule],
      providers: [
        ArlasTagService,
        ArlasCollaborativesearchService,
        ArlasSettingsService,
        OAuthService,
        DateTimeProvider,
        OAuthLogger,
        UrlHelperService,
        AuthentificationService,
        {
          provide: GET_OPTIONS,
          useFactory: getOptionsFactory,
          deps: [AuthentificationService]
        }]
    });
  });

  it('should be created', inject([ArlasSettingsService],
    (arlasSettingsSerivce: ArlasSettingsService) => {
      const service: ArlasTagService = TestBed.get(ArlasTagService);
      expect(service).toBeTruthy();
      expect(arlasSettingsSerivce).toBeTruthy();
    }));
});
