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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { TranslateLoader, TranslateModule, TranslateNoOpLoader } from '@ngx-translate/core';
import { OAuthModule } from 'angular-oauth2-oidc';
import { ArlasBookmarkService } from '../../services/bookmark/bookmark.service';
import { ArlasCollaborativesearchService } from '../../services/collaborative-search/arlas.collaborative-search.service';
import { ArlasConfigurationUpdaterService } from '../../services/configuration-updater/configurationUpdater.service';
import {
  ArlasConfigService, ArlasStartupService, CONFIG_UPDATER, FETCH_OPTIONS
} from '../../services/startup/startup.service';
import { GET_OPTIONS } from '../../tools/utils';
import { BookmarkComponent } from './bookmark.component';

describe('BookmarkComponent', () => {
  let component: BookmarkComponent;
  let fixture: ComponentFixture<BookmarkComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [
        MatTableModule,
        MatCheckboxModule,
        MatIconModule,
        MatPaginatorModule,
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateNoOpLoader } }),
        RouterModule.forRoot([]),
        OAuthModule.forRoot(),
        BookmarkComponent
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
        ArlasConfigurationUpdaterService,
        { provide: FETCH_OPTIONS, useValue: {} },
        provideHttpClient(withInterceptorsFromDi()),
        ArlasBookmarkService,
        {
            provide: GET_OPTIONS,
            useValue: () => { }
        },
        {
            provide: MAT_DIALOG_DATA,
            useValue: {
                isSelect: true
            }
        }
    ]
})
      .compileComponents();

    fixture = TestBed.createComponent(BookmarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
