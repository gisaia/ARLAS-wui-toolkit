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

import { Component, OnInit, Input, Output, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Granularity, TimelineData, TimelineTooltip } from 'arlas-d3';
import { Subject } from 'rxjs';
import { CalendarTimelineComponent, TranslationDirection } from 'arlas-web-components';
import { ArlasOverlayRef } from '../../tools/utils';
import { ArlasOverlayService } from '../../services/overlays/overlay.service';


/**
 * A Widget wraps a component from ARLAS-web-components and bind it to its contributor. The component has thus input data to plot.
 * Note: This component is binded to ARLAS-wui configuration
 */
@Component({
  selector: 'arlas-tool-calendar-timeline',
  templateUrl: './calendar-timeline.component.html',
  styleUrls: ['./calendar-timeline.component.css']
})
export class CalendarTimelineToolComponent implements OnInit, OnDestroy {

  public tooltipEvent: Subject<TimelineTooltip> = new Subject<TimelineTooltip>();

  public timelineOverlayRef: ArlasOverlayRef;
  @Input() public granularity: Granularity;
  @Input() public climatological: boolean;
  @Input() public boundDates: Date[] = [];
  @Input() public data: TimelineData[] = [];
  @Input() public cursorPosition: Date;
  @Input() public hideLeftButton: boolean;
  @Input() public hideRightButton: boolean;
  @Output() public selectedDate: Subject<TimelineData> = new Subject();
  @Output() public hoveredDate: Subject<TimelineTooltip> = new Subject();
  @Output() public translate: Subject<TranslationDirection> = new Subject();

  @ViewChild('calendarTimelineComponent', { static: false }) public calendarTimelineComponent: CalendarTimelineComponent;

  public constructor(
    private arlasOverlayService: ArlasOverlayService
  ) {
  }

  public ngOnInit() {
  }

  public ngOnDestroy() {
    this.tooltipEvent.complete();
    this.tooltipEvent.unsubscribe();

  }


  public showCalendarTimelineooltip(tooltip: TimelineTooltip, e: ElementRef, xOffset: number, yOffset: number, right: boolean) {
    if (!!this.timelineOverlayRef) {
      this.timelineOverlayRef.close();
    }
    if (!!tooltip && tooltip.shown) {
      this.timelineOverlayRef = this.arlasOverlayService.openCalendarTimelineTooltip({ data: tooltip }, e, xOffset, yOffset, right);
    }
  }

  public hideHistogramTooltip() {
    if (!!this.timelineOverlayRef) {
      this.timelineOverlayRef.close();
    }
  }

  public emitTooltip(tooltip: TimelineTooltip, e: ElementRef) {

    const yOffset = -110;
    let xOffset = tooltip.position;
    let right = false;
    if (!!tooltip && tooltip.shown && tooltip.position > tooltip.width / 2) {
      xOffset = -tooltip.width + tooltip.position;
      right = true;
    }
    this.showCalendarTimelineooltip(tooltip, e, xOffset, yOffset, right);
  }

  public onSelectedDate(data: TimelineData) {
    this.selectedDate.next(data);
  }

  public onTranslate(td: TranslationDirection): void {
    this.translate.next(td);
  }

  public plot(): void {
    if (this.calendarTimelineComponent) {
      this.calendarTimelineComponent.plot();
    }
  }
}
