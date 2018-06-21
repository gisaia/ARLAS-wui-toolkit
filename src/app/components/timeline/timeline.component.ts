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

import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { HistogramContributor } from 'arlas-web-contributors';
import { OperationEnum, Contributor } from 'arlas-web-core';
import { ArlasCollaborativesearchService, ArlasStartupService } from './../../services/startup/startup.service';
import { StringifiedTimeShortcut, TimeShortcut, SelectedOutputValues } from 'arlas-web-contributors/models/models';
import * as d3 from 'd3';
import { WidgetComponent } from '../widget/widget.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'arlas-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {

  @Input() public detailedTimelineComponent: any;
  @Input() public timelineComponent: any;
  @ViewChild('timeline') private timelineWidget: WidgetComponent;

  public showDetailedTimeline = false;
  private timelineIsFiltered = false;


  constructor(private arlasCollaborativesearchService: ArlasCollaborativesearchService, private arlasStartupService: ArlasStartupService) {
  }

  public ngOnInit() {
    if (this.timelineComponent && this.detailedTimelineComponent) {
      this.detailedTimelineComponent.input.isHistogramSelectable = false;
      this.showDetailedTimelineOnCollaborationEnd();
    }
  }

  private showDetailedTimelineOnCollaborationEnd(): void {
    this.arlasCollaborativesearchService.collaborationBus.filter(c => (c.id === this.timelineComponent.contributorId || c.all))
      .subscribe(c => {
        if (c.operation === OperationEnum.remove) {
          this.timelineIsFiltered = false;
          this.showDetailedTimeline = false;
          this.timelineWidget.histogramComponent.histogram.histogramParams.chartHeight = this.timelineComponent.input.chartHeight;
          this.timelineWidget.histogramComponent.resizeHistogram();
        } else if (c.operation === OperationEnum.add ) {
          this.timelineIsFiltered = true;
        }
      });

      this.arlasCollaborativesearchService.ongoingSubscribe.subscribe(nb => {
        if (this.arlasCollaborativesearchService.totalSubscribe === 0 && this.timelineIsFiltered) {
          const timelineRange = (<HistogramContributor>this.arlasCollaborativesearchService.registry
            .get(this.timelineComponent.contributorId)).range;
          const detailedTimelineRange = (<HistogramContributor>this.arlasCollaborativesearchService.registry
            .get(this.detailedTimelineComponent.contributorId)).range;
          if (timelineRange && detailedTimelineRange) {
            // For timeline : calculate the range of data + selections
            let min = timelineRange.min;
            let max = timelineRange.max;
            const timelineContributor = this.arlasStartupService.contributorRegistry.get(this.timelineComponent.contributorId);
            timelineContributor.intervalListSelection.forEach( intervalSelection => {
              min = (min > intervalSelection.startvalue) ? intervalSelection.startvalue : min;
              max = (max < intervalSelection.endvalue) ? intervalSelection.endvalue : max;
            });
            min = (min > timelineContributor.intervalSelection.startvalue) ? timelineContributor.intervalSelection.startvalue : min;
            max = (max < timelineContributor.intervalSelection.endvalue) ? timelineContributor.intervalSelection.endvalue : max;
            this.showDetailedTimeline = ((detailedTimelineRange.max - detailedTimelineRange.min) <= 0.2 * (max - min));
            this.timelineWidget.histogramComponent.histogram.histogramParams.chartHeight = (this.showDetailedTimeline) ?
              this.detailedTimelineComponent.input.chartHeight : this.timelineComponent.input.chartHeight;
            this.timelineWidget.histogramComponent.resizeHistogram();
          } else {
            this.showDetailedTimeline = false;
            this.timelineWidget.histogramComponent.histogram.histogramParams.chartHeight = this.timelineComponent.input.chartHeight;
            this.timelineWidget.histogramComponent.resizeHistogram();
          }
        }
      });
  }
}

@Component({
  selector: 'arlas-timeline-shortcut',
  templateUrl: './timeline-shortcut.component.html',
  styleUrls: ['./timeline-shortcut.component.css']
})
export class TimelineShortcutComponent implements OnInit {
  @Input() public timelineComponent: any;
  @Input() public dateFormat: string;

  public timelineContributor: HistogramContributor;
  public timeShortcuts: Array<StringifiedTimeShortcut>;
  public timeShortcutsMap: Map<string, Array<StringifiedTimeShortcut>>;
  public shortcutLabel: string;
  public showRemoveIcon = false;
  public showShortcuts = false;

  constructor(private arlasCollaborativesearchService: ArlasCollaborativesearchService, private arlasStartupService: ArlasStartupService,
    public translate: TranslateService) {
  }

  public ngOnInit() {
      if (this.timelineComponent) {
        this.timelineContributor = this.arlasStartupService.contributorRegistry.get(this.timelineComponent.contributorId);
        this.timeShortcuts = this.timelineContributor.timeShortcuts;
        this.timeShortcuts.forEach(shortcut => {
          shortcut.label = this.translate.instant(shortcut.label);
        });
        this.timeShortcutsMap = this.groupBy(this.timeShortcuts, shortcut => shortcut.type);
        this.setLabelOnCollaborationsEnd();
        this.setRemoveIconVisibility();
      }
  }

  public setShortcut(shortCut: StringifiedTimeShortcut): void {
    const selectedIntervalsList = new Array<SelectedOutputValues>();
    this.timelineContributor.intervalListSelection.forEach(intervalSelection => {
      selectedIntervalsList.push(intervalSelection);
    });
    selectedIntervalsList.push({startvalue: shortCut.from, endvalue: shortCut.to});
    this.timelineContributor.valueChanged(selectedIntervalsList);
    this.shortcutLabel = shortCut.label;
  }

  public getKeys(map): Array<string> {
    return Array.from(map.keys());
  }

  public showSortcuts(): void {
    if (this.timeShortcuts && this.timeShortcuts.length > 0) {
      this.showShortcuts = !this.showShortcuts;
    }
  }

  public removeTimelineCollaboration(): void {
    this.showRemoveIcon = false;
    this.arlasCollaborativesearchService.removeFilter(this.timelineComponent.contributorId);

  }

  private setLabelOnCollaborationsEnd(): void {
    this.arlasCollaborativesearchService.ongoingSubscribe.subscribe(nb => {
      if (this.arlasCollaborativesearchService.totalSubscribe === 0) {
        const label = this.timelineContributor.getShortcutLabel();
        if (!label) {
          const start = new Date(<number>this.timelineContributor.intervalSelection.startvalue);
          const end = new Date(<number>this.timelineContributor.intervalSelection.endvalue);
          if (this.dateFormat) {
            const timeFormat = d3.timeFormat(this.dateFormat);
            this.shortcutLabel = timeFormat(start) + ' to ' + timeFormat(end);
          }
          this.shortcutLabel = start.toLocaleDateString() + ' ' + start.toLocaleTimeString() + ' to '
          + end.toLocaleDateString() + ' ' + end.toLocaleTimeString();
        } else {
          this.shortcutLabel = label;
        }
      }
    });
  }

  private setRemoveIconVisibility(): void {
    this.arlasCollaborativesearchService.collaborationBus.filter(c => (c.id === this.timelineComponent.contributorId || c.all))
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
