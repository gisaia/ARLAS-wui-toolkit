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
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateLoader, TranslateModule, TranslateNoOpLoader } from '@ngx-translate/core';
import { AwcColorGeneratorLoader, ColorGeneratorLoader, ColorGeneratorModule, FormatNumberPipe } from 'arlas-web-components';
import { ArlasCollaborativesearchService } from '../../services/collaborative-search/arlas.collaborative-search.service';
import { ArlasCollectionService } from '../../services/collection/arlas-collection.service';
import { ArlasConfigurationUpdaterService } from '../../services/configuration-updater/configurationUpdater.service';
import {
  ArlasConfigService,
  ArlasStartupService,
  CONFIG_UPDATER, FETCH_OPTIONS
} from '../../services/startup/startup.service';
import { ArlasWalkthroughService } from '../../services/walkthrough/walkthrough.service';
import { FiltersComponent } from './filters.component';

describe('FiltersComponent', () => {
  let component: FiltersComponent;
  let fixture: ComponentFixture<FiltersComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [
        MatChipsModule,
        MatIconModule,
        MatTooltipModule,
        MatMenuModule,
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateNoOpLoader } }),
        FormatNumberPipe,
        ColorGeneratorModule.forRoot({
            loader: {
                provide: ColorGeneratorLoader,
                useClass: AwcColorGeneratorLoader
            }
        }),
        FiltersComponent
    ],
    providers: [
        {
            provide: ArlasStartupService,
            useClass: ArlasStartupService,
            deps: [ArlasConfigurationUpdaterService]
        },
        ArlasConfigService,
        ArlasCollaborativesearchService,
        ArlasWalkthroughService,
        { provide: CONFIG_UPDATER, useValue: {} },
        ArlasConfigurationUpdaterService,
        { provide: FETCH_OPTIONS, useValue: {} },
        provideHttpClient(withInterceptorsFromDi()),
        ArlasCollectionService
    ]
})
      .compileComponents();

    fixture = TestBed.createComponent(FiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
