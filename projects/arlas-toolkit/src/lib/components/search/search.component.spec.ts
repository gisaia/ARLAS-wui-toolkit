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
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule, TranslateNoOpLoader } from '@ngx-translate/core';
import { AwcColorGeneratorLoader, ColorGeneratorLoader, ColorGeneratorModule } from 'arlas-web-components';
import { ArlasCollaborativesearchService } from '../../services/collaborative-search/arlas.collaborative-search.service';
import { ArlasConfigurationUpdaterService } from '../../services/configuration-updater/configurationUpdater.service';
import {
  ArlasConfigService, ArlasStartupService, CONFIG_UPDATER, FETCH_OPTIONS
} from '../../services/startup/startup.service';
import { SearchComponent } from './search.component';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatInputModule,
        FormsModule,
        BrowserAnimationsModule,
        MatIconModule,
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateNoOpLoader } }),
        ColorGeneratorModule.forRoot({
            loader: {
                provide: ColorGeneratorLoader,
                useClass: AwcColorGeneratorLoader
            }
        }),
        SearchComponent
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
        provideHttpClient(withInterceptorsFromDi())
    ]
})
      .compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('searchContributors', []);
    fixture.detectChanges();
  });

  it('should create', (() => {
    expect(component).toBeTruthy();
  }));
});
