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
import { TranslateLoader, TranslateModule, TranslateNoOpLoader } from '@ngx-translate/core';
import {
  AwcColorGeneratorLoader, ColorGeneratorLoader, ColorGeneratorModule
} from 'arlas-web-components';
import { beforeEach, describe, expect, it } from 'vitest';
import { ArlasCollaborativesearchService } from '../../../services/collaborative-search/arlas.collaborative-search.service';
import { ArlasCollectionService } from '../../../services/collection/arlas-collection.service';
import { ArlasConfigurationUpdaterService } from '../../../services/configuration-updater/configurationUpdater.service';
import { ArlasOverlayService } from '../../../services/overlays/overlay.service';
import {
  ArlasConfigService, ArlasStartupService, CONFIG_UPDATER, FETCH_OPTIONS
} from '../../../services/startup/startup.service';
import { TimelineShortcutComponent } from '../timeline-shortcut/timeline-shortcut.component';
import { TimelineComponent } from './timeline.component';


describe('TimelineComponent', () => {
  let component: TimelineComponent;
  let fixture: ComponentFixture<TimelineComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [
        TranslateModule.forRoot({
            loader: { provide: TranslateLoader, useClass: TranslateNoOpLoader }
        }),
        ColorGeneratorModule.forRoot({
            loader: {
                provide: ColorGeneratorLoader,
                useClass: AwcColorGeneratorLoader
            }
        }),
        TimelineComponent
      ],
    providers: [
        ArlasCollaborativesearchService,
        ArlasOverlayService,
        {
            provide: ArlasStartupService,
            useClass: ArlasStartupService,
            deps: [ArlasConfigurationUpdaterService]
        },
        ArlasConfigService,
        { provide: CONFIG_UPDATER, useValue: {} },
        {
            provide: ArlasConfigurationUpdaterService,
            useClass: ArlasConfigurationUpdaterService
        },
        { provide: FETCH_OPTIONS, useValue: {} },
        provideHttpClient(withInterceptorsFromDi()),
        ArlasCollectionService
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
