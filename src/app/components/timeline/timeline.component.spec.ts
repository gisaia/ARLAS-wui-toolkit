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

import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { MatButtonModule, MatCardModule, MatExpansionModule, MatIconModule, MatSelectModule, MatTooltipModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { DonutModule, HistogramModule, PowerbarsModule, ResultsModule } from 'arlas-web-components';
import { ArlasCollaborativesearchService, ArlasStartupService, ArlasConfigService } from '../../services/startup/startup.service';
import { WidgetComponent } from '../widget/widget.component';
import { TimelineComponent } from './timeline.component';
import { TranslateModule, TranslateService, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';
import { HttpModule } from '@angular/http';

describe('TimelineComponent', () => {
  let component: TimelineComponent;
  let fixture: ComponentFixture<TimelineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimelineComponent, WidgetComponent ],
      imports: [
        MatCardModule, MatIconModule, MatExpansionModule, MatSelectModule, MatButtonModule,
        MatTooltipModule, BrowserModule, HistogramModule, ResultsModule, PowerbarsModule, DonutModule, HttpModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
        })
      ],
      providers: [
        ArlasCollaborativesearchService, ArlasStartupService, ArlasConfigService, TranslateService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
