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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendComponent } from './extend.component';
import { MatTableModule, MatCheckboxModule, MatIconModule, MatPaginatorModule, MatPaginator } from '@angular/material';
import {
  ArlasStartupService, ArlasConfigService, ArlasCollaborativesearchService,
  CONFIG_UPDATER
} from '../../services/startup/startup.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateService, TranslateModule, TranslateFakeLoader, TranslateLoader } from '@ngx-translate/core';

describe('ExtendComponent', () => {
  let component: ExtendComponent;
  let fixture: ComponentFixture<ExtendComponent>;
  let arlasStartupService: ArlasStartupService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatTableModule, MatCheckboxModule, MatIconModule, HttpClientModule, MatPaginatorModule,
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateFakeLoader } })
      ],
      declarations: [ExtendComponent],
      providers: [
        ArlasConfigService, ArlasCollaborativesearchService,
        ArlasStartupService, HttpClient, TranslateService,
        { provide: CONFIG_UPDATER, useValue: {} }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    arlasStartupService = TestBed.get(ArlasStartupService);
    arlasStartupService.arlasIsUp.subscribe(isUp => {
      if (isUp) {
        fixture = TestBed.createComponent(ExtendComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      }
    });
  });

  it('should create', () => {
    arlasStartupService.arlasIsUp.subscribe(isUp => {
      if (isUp) {
        expect(component).toBeTruthy();
      }
    });
  });
});
