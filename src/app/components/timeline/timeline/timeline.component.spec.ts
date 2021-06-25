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

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@gisaia-team/ng-pick-datetime';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { DatePickerComponent } from 'app/components/timeline/date-picker/date-picker.component';
import { DonutModule, HistogramModule, MetricModule, PowerbarsModule, ResultsModule } from 'arlas-web-components';
import { GetTimeLabelPipe } from '../../../pipes/get-time-label.pipe';
import { ArlasConfigurationUpdaterService } from '../../../services/configuration-updater/configurationUpdater.service';
import { ArlasOverlayService } from '../../../services/overlays/overlay.service';
import { ArlasColorGeneratorLoader } from '../../../services/color-generator-loader/color-generator-loader.service';
import {
  ArlasCollaborativesearchService, ArlasConfigService, ArlasStartupService, CONFIG_UPDATER,
  FETCH_OPTIONS
} from '../../../services/startup/startup.service';
import { TimelineShortcutComponent } from '../../timeline/timeline-shortcut/timeline-shortcut.component';
import { TimelineComponent } from './timeline.component';

describe('TimelineComponent', () => {
  let component: TimelineComponent;
  let fixture: ComponentFixture<TimelineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TimelineComponent, DatePickerComponent, TimelineShortcutComponent, GetTimeLabelPipe],
      imports: [
        MatCardModule, MatIconModule, MatExpansionModule, MatSelectModule, MatButtonModule, MatChipsModule,
        OwlDateTimeModule, OwlNativeDateTimeModule, FormsModule, HttpClientModule,
        MatTooltipModule, BrowserModule, HistogramModule, ResultsModule, PowerbarsModule, DonutModule, MetricModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
        })
      ],
      providers: [
        ArlasCollaborativesearchService,
        ArlasColorGeneratorLoader,
        ArlasOverlayService,
        {
          provide: ArlasStartupService,
          useClass: ArlasStartupService,
          deps: [ArlasConfigurationUpdaterService]
        },
        ArlasConfigService, TranslateService, HttpClient,
        {provide: CONFIG_UPDATER, useValue: {}},
        {
          provide: ArlasConfigurationUpdaterService,
          useClass: ArlasConfigurationUpdaterService
        },
        {provide: FETCH_OPTIONS, useValue: {}},
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
