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

import { KeyValuePipe } from '@angular/common';
import { Component, computed, EventEmitter, input, Input, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { marker } from '@colsen1991/ngx-translate-extract-marker';
import { TranslatePipe } from '@ngx-translate/core';
import { HistogramContributor, SelectedOutputValues, StringifiedTimeShortcut } from 'arlas-web-contributors';
import { OperationEnum } from 'arlas-web-core';
import { filter } from 'rxjs/operators';
import { GetTimeLabelPipe } from '../../../pipes/get-time-label.pipe';
import { ArlasCollaborativesearchService } from '../../../services/collaborative-search/arlas.collaborative-search.service';
import { ArlasStartupService } from '../../../services/startup/startup.service';
import { DatePickerComponent } from '../date-picker/date-picker.component';
import { TimelineConfiguration } from '../timeline/timeline.utils';

/**
 * This component contains shortcut labels that allow to apply predefined temporal filters on a timeline
 * (Last year, Last month, Today, etc ...).
 * It also displays the start and end values of the current selection on the timeline. And if enabled, a datepicker is allowed on those
 * start and end values.
 * This component is used internally in `TimelineComponent`
 */
@Component({
  selector: 'arlas-timeline-shortcut',
  templateUrl: './timeline-shortcut.component.html',
  styleUrls: ['./timeline-shortcut.component.scss'],
  imports: [
    MatChipsModule,
    MatIconModule,
    MatTooltipModule,
    TranslatePipe,
    GetTimeLabelPipe,
    DatePickerComponent,
    KeyValuePipe,
    MatButtonModule
  ]
})
export class TimelineShortcutComponent implements OnInit {
  /**
  * @Input : Angular
  * @description In this object, all the necessary inputs of HistogramComponent (ARLAS-web-components)
  * must be set as well as the identifier of the contributor that fetches timeline data. The `HistogramContributor`
  * should be declared before in the `contributorRegistry` of `ArlasStartupService`
  */
  public timelineComponent = input.required<TimelineConfiguration>();
  /**
   * @Input : Angular
   * @description Optional input. Sets the format of start/end date values of the timeline.
   */
  @Input() public dateFormat?: string;
  /**
   * @Input : Angular
   * @description Whether the date picker is enabled
   */
  @Input() public activeDatePicker = false;

  /**
   * @Input : Angular
   * @description Whether to display the timelines' histogram
   */
  @Input() public isDisplayHistogram = true;

  /**
   * @Output : Angular
   * @description Emits when the value of isDisplayHistogram changes
   */
  @Output() public isDisplayHistogramChange = new EventEmitter();

  /**
   * @Output : Angular
   * @description Emits when the timeline collaboration is removed
   */
  @Output() public removeCollaboration = new EventEmitter<void>();

  public timelineContributor = computed(() => {
    const contributor = this.arlasStartupService.contributorRegistry.get(this.timelineComponent().contributorId) as HistogramContributor;
    contributor.updateData = true;
    return contributor;
  });

  public timeShortcuts = computed(() => this.timelineContributor().timeShortcuts);
  public timeShortcutsMap = computed(() => this.groupBy(this.timeShortcuts(), shortcut => shortcut.type));
  public showRemoveIcon = false;
  public showShortcuts = false;
  public HIDE_SHOW: string = marker('Show time shortcuts');
  public isShortcutSelected = false;
  public timeZone = 'UTC';

  public constructor(
    private readonly arlasCollaborativesearchService: ArlasCollaborativesearchService,
    private readonly arlasStartupService: ArlasStartupService
  ) {
    this.arlasCollaborativesearchService.collaborationBus.pipe(filter(c => ((c.id === this.timelineComponent().contributorId) || c.all)))
      .subscribe(data => {
        if (this.timelineContributor().timeLabel?.indexOf('to') === -1) {
          this.isShortcutSelected = true;
        } else {
          this.isShortcutSelected = false;
        }
      });
  }
  public ngOnInit() {
    this.setRemoveIconVisibility();
    if (!this.timelineContributor().useUtc) {
      this.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    }
  }

  /**
   * Applies a temporal filter on timeline according to the chosen shortcut.
   * @param shortCut
   */
  public setShortcut(shortCut: StringifiedTimeShortcut): void {
    const selectedIntervalsList = new Array<SelectedOutputValues>();
    this.timelineContributor().intervalListSelection.forEach(intervalSelection => {
      selectedIntervalsList.push(intervalSelection);
    });
    selectedIntervalsList.push({ startvalue: shortCut.from, endvalue: shortCut.to });
    this.timelineContributor().valueChanged(selectedIntervalsList, this.timelineContributor().getAllCollections());
  }

  /**
   * Shows/hides the `div` containing the shortcuts list
   */
  public showSortcuts(): void {
    if (this.timeShortcuts() && this.timeShortcuts().length > 0) {
      this.showShortcuts = !this.showShortcuts;
      if (this.showShortcuts) {
        this.HIDE_SHOW = marker('Hide time shortcuts');
      } else {
        this.HIDE_SHOW = marker('Show time shortcuts');
      }
    }
  }

  /**
   * Removes all temporal filters of the timeline
   */
  public removeTimelineCollaboration(): void {
    this.showRemoveIcon = false;
    this.isShortcutSelected = false;
    this.removeCollaboration.next();
  }

  public toggleTimeline() {
    this.isDisplayHistogram = !this.isDisplayHistogram;
    this.isDisplayHistogramChange.next(this.isDisplayHistogram);
  }

  /**
   * Shows or hides the icon that allows to clear all temporal filter. This icon is displayed when there filters on the timeline.
   */
  private setRemoveIconVisibility(): void {
    this.arlasCollaborativesearchService.collaborationBus.pipe(filter(c => (c.id === this.timelineComponent().contributorId || c.all)))
      .subscribe(c => {
        if (c.operation === OperationEnum.remove) {
          this.showRemoveIcon = false;
        } else if (c.operation === OperationEnum.add &&
          this.arlasCollaborativesearchService.collaborations.has(this.timelineComponent().contributorId)) {
          this.showRemoveIcon = true;
        }
      });
  }

  private groupBy(list: StringifiedTimeShortcut[], keyGetter: (short: StringifiedTimeShortcut) => string) {
    const map = new Map();
    list.forEach((item) => {
      const key = keyGetter(item);
      const collection = map.get(key);
      if (!collection) {
        map.set(key, [item]);
      } else {
        collection.push(item);
      }
    });
    return map;
  }
}
