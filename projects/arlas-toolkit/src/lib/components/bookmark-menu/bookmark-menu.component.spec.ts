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
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { TranslateLoader, TranslateModule, TranslateNoOpLoader } from '@ngx-translate/core';
import { OAuthModule } from 'angular-oauth2-oidc';
import { ArlasBookmarkService } from '../../services/bookmark/bookmark.service';
import { ArlasCollaborativesearchService } from '../../services/collaborative-search/arlas.collaborative-search.service';
import { ArlasConfigurationUpdaterService } from '../../services/configuration-updater/configurationUpdater.service';
import {
  ArlasConfigService,
  ArlasStartupService,
  CONFIG_UPDATER, FETCH_OPTIONS
} from '../../services/startup/startup.service';
import { GET_OPTIONS } from '../../tools/utils';
import { BookmarkMenuComponent } from './bookmark-menu.component';

describe('BookmarkMenuComponent', () => {
  let component: BookmarkMenuComponent;
  let fixture: ComponentFixture<BookmarkMenuComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [
        MatMenuModule,
        MatIconModule,
        MatTooltipModule,
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateNoOpLoader } }),
        RouterModule.forRoot([]),
        OAuthModule.forRoot(),
        BookmarkMenuComponent
    ],
    providers: [
        ArlasConfigService,
        ArlasCollaborativesearchService,
        {
            provide: ArlasStartupService,
            useClass: ArlasStartupService,
            deps: [ArlasConfigurationUpdaterService]
        },
        { provide: CONFIG_UPDATER, useValue: {} },
        {
            provide: ArlasConfigurationUpdaterService,
            useClass: ArlasConfigurationUpdaterService
        },
        { provide: FETCH_OPTIONS, useValue: {} },
        provideHttpClient(withInterceptorsFromDi()),
        ArlasBookmarkService,
        {
            provide: GET_OPTIONS,
            useValue: () => { }
        }
    ]
})
      .compileComponents();

    fixture = TestBed.createComponent(BookmarkMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
