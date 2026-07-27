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
import { TEST_CONTRIBUTOR_ID } from '../../../../tests/arlas-config-service.mock';
import { MockArlasStartupService } from '../../../../tests/arlas-startup-service.mock';
import { ArlasCollaborativesearchService } from '../../../services/collaborative-search/arlas.collaborative-search.service';
import { ArlasCollectionService } from '../../../services/collection/arlas-collection.service';
import { ArlasOverlayService } from '../../../services/overlays/overlay.service';
import {
  ArlasConfigService, ArlasStartupService, CONFIG_UPDATER, FETCH_OPTIONS
} from '../../../services/startup/startup.service';
import { GET_OPTIONS } from '../../../tools/utils';
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
          useClass: MockArlasStartupService
        },
        ArlasConfigService,
        { provide: CONFIG_UPDATER, useValue: {} },
        { provide: FETCH_OPTIONS, useValue: {} },
        provideHttpClient(withInterceptorsFromDi()),
        ArlasCollectionService,
        { provide: GET_OPTIONS, useValue: () => { } },
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelineComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('timelineComponent', { contributorId: TEST_CONTRIBUTOR_ID, input: {} });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
