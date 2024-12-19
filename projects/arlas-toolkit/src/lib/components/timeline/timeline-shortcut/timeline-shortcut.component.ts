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

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HistogramContributor } from 'arlas-web-contributors';
import { SelectedOutputValues, StringifiedTimeShortcut } from 'arlas-web-contributors/models/models';
import { OperationEnum } from 'arlas-web-core';
import { filter } from 'rxjs/operators';
import { ArlasCollaborativesearchService } from '../../../services/collaborative-search/arlas.collaborative-search.service';
import { ArlasStartupService } from '../../../services/startup/startup.service';

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
  styleUrls: ['./timeline-shortcut.component.scss']
})
export class TimelineShortcutComponent implements OnInit {
  /**
  * @Input : Angular
  * @description In this object, all the necessary inputs of HistogramComponent (ARLAS-web-components)
  * must be set as well as the identifier of the contributor that fetches timeline data. The `HistogramContributor`
  * should be declared before in the `contributorRegistry` of `ArlasStartupService`
  */
  @Input() public timelineComponent: any;
  /**
   * @Input : Angular
   * @description Optional input. Sets the format of start/end date values of the timeline.
   */
  @Input() public dateFormat: string;
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

  public timelineContributor: HistogramContributor;
  public timeShortcuts: Array<StringifiedTimeShortcut>;
  public timeShortcutsMap: Map<string, Array<StringifiedTimeShortcut>>;
  public showRemoveIcon = false;
  public showShortcuts = false;
  public HIDE_SHOW = 'Show';
  public isShortcutSelected = false;
  public timeZone = 'UTC';

  public constructor(private arlasCollaborativesearchService: ArlasCollaborativesearchService, private arlasStartupService: ArlasStartupService,
    public translate: TranslateService) {
    this.arlasCollaborativesearchService.collaborationBus.pipe(filter(c => ((this.timelineComponent
      && c.id === this.timelineComponent.contributorId) || c.all)))
      .subscribe(data => {
        if (this.timelineContributor && this.timelineContributor.timeLabel !== undefined
          && this.timelineContributor.timeLabel.indexOf('to') === -1) {
          this.isShortcutSelected = true;
        } else {
          this.isShortcutSelected = false;
        }
      });

  }
  public ngOnInit() {
    if (this.timelineComponent) {
      this.timelineContributor = <HistogramContributor>this.arlasStartupService.contributorRegistry
        .get(this.timelineComponent.contributorId);
      this.timelineContributor.updateData = true;
      this.timeShortcuts = this.timelineContributor.timeShortcuts;
      this.timeShortcutsMap = this.groupBy(this.timeShortcuts, shortcut => shortcut.type);
      this.setRemoveIconVisibility();
      if (!this.timelineContributor.useUtc) {
        this.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      }
    }
  }

  /**
   * Applies a temporal filter on timeline according to the chosen shortcut.
   * @param shortCut
   */
  public setShortcut(shortCut: StringifiedTimeShortcut): void {
    const selectedIntervalsList = new Array<SelectedOutputValues>();
    if (this.timelineContributor) {
      this.timelineContributor.intervalListSelection.forEach(intervalSelection => {
        selectedIntervalsList.push(intervalSelection);
      });
      selectedIntervalsList.push({ startvalue: shortCut.from, endvalue: shortCut.to });
      this.timelineContributor.valueChanged(selectedIntervalsList, this.timelineContributor.getAllCollections());
    }
  }

  /**
   * Shows/hides the `div` containing the shortcuts list
   */
  public showSortcuts(): void {
    if (this.timeShortcuts && this.timeShortcuts.length > 0) {
      this.showShortcuts = !this.showShortcuts;
      if (this.showShortcuts) {
        this.HIDE_SHOW = 'Hide';
      } else {
        this.HIDE_SHOW = 'Show';
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
    this.arlasCollaborativesearchService.collaborationBus.pipe(filter(c => (c.id === this.timelineComponent.contributorId || c.all)))
      .subscribe(c => {
        if (c.operation === OperationEnum.remove) {
          this.showRemoveIcon = false;
        } else if (c.operation === OperationEnum.add &&
          this.arlasCollaborativesearchService.collaborations.has(this.timelineComponent.contributorId)) {
          this.showRemoveIcon = true;
        }
      });
  }

  private groupBy(list, keyGetter) {
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
