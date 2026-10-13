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

import { Component, computed, inject, input, OnChanges, signal, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  DateTimeAdapter, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE, OwlDateTimeModule, OwlNativeDateTimeModule
} from '@danielmoncada/angular-datetime-picker';
import {
  MomentDateTimeAdapter, OWL_MOMENT_DATE_TIME_ADAPTER_OPTIONS, OwlMomentDateTimeModule
} from '@danielmoncada/angular-datetime-picker-moment-adapter';
import { TranslatePipe } from '@ngx-translate/core';
import { HistogramContributor } from 'arlas-web-contributors';
import moment from 'moment';
import { ArlasStartupService } from '../../../services/startup/startup.service';
import { TimelineConfiguration } from '../timeline/timeline.utils';
import { ARLAS_DATE_TIME_FORMATS, ARLAS_OWL_MOMENT_ADAPTER_OPTIONS } from './date-time-formats.token';

/**
 * The component allows to set start/end values of a temporal selection on the timeline
 */
@Component({
  selector: 'arlas-tool-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  providers: [
    {
      provide: OWL_MOMENT_DATE_TIME_ADAPTER_OPTIONS,
      useFactory: () => inject(ARLAS_OWL_MOMENT_ADAPTER_OPTIONS)
    },
    {
      provide: DateTimeAdapter,
      useClass: MomentDateTimeAdapter,
      deps: [OWL_DATE_TIME_LOCALE, OWL_MOMENT_DATE_TIME_ADAPTER_OPTIONS] },
    {
      provide: OWL_DATE_TIME_FORMATS,
      useFactory: () => inject(ARLAS_DATE_TIME_FORMATS)
    }
  ],
  imports: [
    TranslatePipe,
    OwlNativeDateTimeModule,
    OwlMomentDateTimeModule,
    OwlDateTimeModule,
    FormsModule
  ]
})
export class DatePickerComponent implements OnChanges {

  /**
   * @Input : Angular
   * @description Start value of the date picker. It must be date or a timestamp.
   */
  public startSelectedDate = input.required<Date | number | string | undefined>();

  /**
   * @Input : Angular
   * @description End value of the date picker. It must be date or a timestamp.
   */
  public endSelectedDate = input.required<Date | number | string | undefined>();

  /**
   * @Input : Angular
   * @description In this object, all the necessary inputs of HistogramComponent (ARLAS-web-components)
   * must be set as well as the identifier of the contributor that fetches timeline data. The `HistogramContributor`
   * should be declared before in the `contributorRegistry` of `ArlasStartupService`.
   */
  public timelineComponent = input.required<TimelineConfiguration>();

  public timelineContributor = computed(() => {
    const contributor = this.arlasStartupService.contributorRegistry.get(this.timelineComponent().contributorId) as HistogramContributor;
    contributor.updateData = true;
    return contributor;
  });

  public startSelectedMoment = signal<moment.Moment>(moment(0));
  public endSelectedMoment = signal<moment.Moment>(moment(0));

  public constructor(
    private readonly arlasStartupService: ArlasStartupService) {
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.startSelectedDate) {
      this.startSelectedMoment.set(this.convertDateToMoment(this.startSelectedDate()));
    }
    if (changes.endSelectedDate) {
      this.endSelectedMoment.set(this.convertDateToMoment(this.endSelectedDate()));
    }
  }

  /**
   * Applies a temporal filter on the timeline when a date is selected on the date picker
   */
  public setDate(): void {
    const selectedIntervalsList = new Array();
    this.timelineContributor().intervalListSelection
      .forEach(intervalSelection => {
        selectedIntervalsList.push(intervalSelection);
      });
    selectedIntervalsList
      .push({
        startvalue: this.fixUtc(this.startSelectedMoment()).valueOf(),
        endvalue: this.fixUtc(this.endSelectedMoment()).valueOf()
      });
    this.timelineContributor().valueChanged(selectedIntervalsList, this.timelineContributor().getAllCollections());
  }

  public convertDateToMoment(date: Date | number | string | undefined) {
    if (this.timelineContributor().useUtc) {
      return moment.utc(date);
    } else {
      return moment(date);
    }
  }

  /** Owl-datetime-picker produces a moment that is based on the local.
   * Offsets the time by the UTC offset to receive a correct UTC time when updating the contributor. */
  public fixUtc(date: moment.Moment) {
    if (this.timelineContributor().useUtc) {
      const localUTCSOffset = date.utcOffset();
      return date.add(localUTCSOffset, 'minutes');
    }
    return date;
  }

  /**
   * Adds mat button class to define the material theme variables to uniformize the format of the buttons
   */
  public addButtonClass() {
    const buttons = document.getElementsByClassName('owl-dt-container-control-button');

    if (buttons.length !== 2) {
      console.warn('Could not find the date picker buttons.');
      return;
    }

    buttons.item(0)?.classList.add('mat-mdc-outlined-button');
    buttons.item(1)?.classList.add('mat-mdc-unelevated-button', 'mat-primary');
  }
}
