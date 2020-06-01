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

import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { MatChipsModule, MatIconModule, MatMenuModule, MatTooltipModule } from '@angular/material';
import {
  ArlasStartupService,
  ArlasCollaborativesearchService,
  ArlasConfigService, CONFIG_UPDATER
} from '../../services/startup/startup.service';
import { FiltersComponent } from './filters.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateService, TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';
import { ArlasWalkthroughService } from '../../services/walkthrough/walkthrough.service';
import { FormatNumberModule } from 'arlas-web-components';


describe('FiltersChipsComponent', () => {
  let component: FiltersComponent;
  let fixture: ComponentFixture<FiltersComponent>;
  let arlasStartupService: ArlasStartupService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatChipsModule, MatIconModule, MatTooltipModule, MatMenuModule,
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateFakeLoader } }),
        FormatNumberModule,
        HttpClientModule
      ],
      declarations: [FiltersComponent],
      providers: [
        ArlasStartupService, ArlasConfigService, ArlasCollaborativesearchService,
        ArlasWalkthroughService, HttpClient, TranslateService,
        { provide: CONFIG_UPDATER, useValue: {} }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    arlasStartupService = TestBed.get(ArlasStartupService);
    arlasStartupService.arlasIsUp.subscribe(isUp => {
      if (isUp) {
        fixture = TestBed.createComponent(FiltersComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      }
    });
  });

  it('should create', (() => {
    arlasStartupService.arlasIsUp.subscribe(isUp => {
      if (isUp) {
        expect(component).toBeTruthy();
      }
    });
  }));
});
