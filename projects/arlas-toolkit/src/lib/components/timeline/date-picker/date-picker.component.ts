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

import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import * as _moment from 'moment';
import { DateTimeAdapter, OWL_DATE_TIME_LOCALE, OwlDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { MomentDateTimeAdapter } from '@danielmoncada/angular-datetime-picker-moment-adapter';

import { HistogramContributor } from 'arlas-web-contributors';
import { ArlasStartupService } from '../../../services/startup/startup.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

const moment = (_moment as any).default ? (_moment as any).default : _moment;

/**
 * The component allows to set start/end values of a temporal selection on the timeline
 */
@Component({
  selector: 'arlas-tool-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  providers: [
    { provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE] }
  ],
  standalone: true,
  imports: [FormsModule, OwlDateTimeModule, TranslateModule]
})
export class DatePickerComponent implements OnInit, OnChanges {

  /**
   * @Input : Angular
   * @description Start value of the date picker. It must be date or a timestamp.
   */
  @Input() public startSelectedDate: Date | number;

  /**
   * @Input : Angular
   * @description End value of the date picker. It must be date or a timestamp.
   */
  @Input() public endSelectedDate: Date | number;

  /**
   * @Input : Angular
   * @description In this object, all the necessary inputs of HistogramComponent (ARLAS-web-components)
   * must be set as well as the identifier of the contributor that fetches timeline data. The `HistogramContributor`
   * should be declared before in the `contributorRegistry` of `ArlasStartupService`.
   */
  @Input() public timelineComponent: any;

  public timelineContributor: HistogramContributor;

  public startSelectedMoment: _moment.Moment;
  public endSelectedMoment: _moment.Moment;

  public constructor(
    private arlasStartupService: ArlasStartupService,
    public translate: TranslateService) {
  }

  public ngOnInit() {
    if (this.timelineComponent) {
      this.timelineContributor = <HistogramContributor>
        this.arlasStartupService.contributorRegistry.get(this.timelineComponent.contributorId);
      this.timelineContributor.updateData = true;

      // Sometimes the Inputs are received before the OnInit hook and thus don't trigger onChanges
      if (this.startSelectedDate) {
        this.startSelectedMoment = this.convertDateToMoment(this.startSelectedDate);
      }
      if (this.endSelectedDate) {
        this.endSelectedMoment = this.convertDateToMoment(this.endSelectedDate);
      }
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['startSelectedDate'] !== undefined) {
      if (!!this.timelineContributor) {
        this.startSelectedMoment = this.convertDateToMoment(changes['startSelectedDate'].currentValue);
      }
    }
    if (changes['endSelectedDate'] !== undefined) {
      if (!!this.timelineContributor) {
        this.endSelectedMoment = this.convertDateToMoment((changes['endSelectedDate'].currentValue));
      }
    }
  }

  /**
   * Applies a temporal filter on the timeline when a date is selected on the date picker
   */
  public setDate(): void {
    const selectedIntervalsList = new Array();
    this.timelineContributor.intervalListSelection
      .forEach(intervalSelection => {
        selectedIntervalsList.push(intervalSelection);
      });
    selectedIntervalsList
      .push({
        startvalue: this.fixUtc(this.startSelectedMoment).valueOf(),
        endvalue: this.fixUtc(this.endSelectedMoment).valueOf()
      });
    this.timelineContributor.valueChanged(selectedIntervalsList, this.timelineContributor.getAllCollections());
  }

  public convertDateToMoment(date: Date | number) {
    if (this.timelineContributor.useUtc) {
      return moment.utc(date);
    } else {
      return moment(date);
    }
  }

  /** Owl-datetime-picker produces a moment that is based on the local.
   * Offsets the time by the UTC offset to receive a correct UTC time when updating the contributor. */
  public fixUtc(date: _moment.Moment) {
    if (this.timelineContributor.useUtc) {
      const localUTCSOffset = date.utcOffset();
      return date.add(localUTCSOffset, 'minutes');
    }
    return date;
  }
}
