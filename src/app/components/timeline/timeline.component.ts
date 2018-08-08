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

import { Component, Input, OnInit, ViewChild, ChangeDetectorRef, Pipe, PipeTransform } from '@angular/core';
import { HistogramContributor, DetailedHistogramContributor } from 'arlas-web-contributors';
import { OperationEnum } from 'arlas-web-core';
import { ArlasCollaborativesearchService, ArlasStartupService } from './../../services/startup/startup.service';
import { StringifiedTimeShortcut, SelectedOutputValues } from 'arlas-web-contributors/models/models';
import * as d3 from 'd3';
import { TranslateService } from '@ngx-translate/core';
import { ChartType, DataType, Position } from 'arlas-d3';
import { HistogramComponent } from 'arlas-web-components';

@Component({
  selector: 'arlas-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {

  @Input() public detailedTimelineComponent: any;
  @Input() public timelineComponent: any;
  @ViewChild('timeline') public timelineHistogramComponent: HistogramComponent;
  @ViewChild('detailedtimeline') public detailedTimelineHistogramComponent: HistogramComponent;

  public showDetailedTimeline = false;
  public detailedTimelineContributor: DetailedHistogramContributor;
  public timelineContributor: HistogramContributor;
  public detailedTimelineIntervalSelection: SelectedOutputValues;

  private isDetailedIntervalBrushed = false;
  private applicationFirstLoad = false;
  private timelineIsFiltered = false;

  constructor(private arlasCollaborativesearchService: ArlasCollaborativesearchService, private cdr: ChangeDetectorRef,
    private arlasStartupService: ArlasStartupService) {
  }

  public ngOnInit() {
    if (this.timelineComponent && this.detailedTimelineComponent) {
      this.resetHistogramsInputs(this.timelineComponent.input);
      this.resetHistogramsInputs(this.detailedTimelineComponent.input);
      this.detailedTimelineContributor = this.arlasStartupService.contributorRegistry.get(this.detailedTimelineComponent.contributorId);
      this.timelineContributor = this.arlasStartupService.contributorRegistry.get(this.timelineComponent.contributorId);
      this.showDetailedTimelineOnCollaborationEnd();
    } else if (this.timelineComponent) {
      this.resetHistogramsInputs(this.timelineComponent.input);
      this.timelineContributor = this.arlasStartupService.contributorRegistry.get(this.timelineComponent.contributorId);
    }
  }

  /**
   * Recalculates the new data of detailed timeline and resets its own current selection.
   * @param selections List containing only the current selection of detailed timeline
   */
  public onDetailedIntervalBrushed(selections: SelectedOutputValues[]): void {
    this.isDetailedIntervalBrushed = true;
    this.detailedTimelineIntervalSelection = {startvalue: selections[0].startvalue, endvalue: selections[0].endvalue};
    this.timelineContributor.valueChanged(this.timelineContributor.intervalListSelection.concat(selections));
  }

  /**
   * Runs when the selection is brushed on timeline.
   * @param selections List containing only the current selection of detailed timeline
   */
  public onTimelineIntervalBrushed(selections: SelectedOutputValues[]): void {
    this.timelineContributor.valueChanged(selections);
  }

  /**
   * Runs when the detailed timeline is plotted.
   * Sets current selection of detailed timeline after it is plotted
   * Applies the current selection of detailed timeline on the main timeline
   */
  public afterDetailedDataPlotted() {
    if (this.isDetailedIntervalBrushed) {  // If detailed timeline is replotted after moving its own brush.
      // Reset current selection of detailed timeline after it is plotted
      this.detailedTimelineIntervalSelection = { startvalue: this.detailedTimelineIntervalSelection.startvalue,
        endvalue: this.detailedTimelineIntervalSelection.endvalue };
      // Apply the current selection of detailed timeline on the main timeline
      this.timelineContributor.intervalSelection = { startvalue: this.detailedTimelineIntervalSelection.startvalue,
        endvalue: this.detailedTimelineIntervalSelection.endvalue };
    } else { // If detailed timeline is replotted after moving the brush of the main timeline or when the app is loaded.
      const selection =  this.timelineContributor.intervalSelection;
      if (selection) {
        this.detailedTimelineIntervalSelection = { startvalue: selection.startvalue, endvalue: selection.endvalue };
      } else {
        this.applicationFirstLoad = true;
      }
    }
    this.isDetailedIntervalBrushed = false;
    this.cdr.detectChanges();
  }

  private showDetailedTimelineOnCollaborationEnd(): void {
    this.arlasCollaborativesearchService.collaborationBus.filter(c => (c.id === this.timelineComponent.contributorId || c.all))
      .subscribe(c => {
        if (c.operation === OperationEnum.remove) {
          this.timelineIsFiltered = false;
          this.showDetailedTimeline = false;
          this.timelineHistogramComponent.histogram.histogramParams.chartHeight = this.timelineComponent.input.chartHeight;
          this.timelineHistogramComponent.resizeHistogram();
        } else if (c.operation === OperationEnum.add ) {
          this.timelineIsFiltered = true;
        }
      });

      this.arlasCollaborativesearchService.ongoingSubscribe.subscribe(nb => {
        if (this.arlasCollaborativesearchService.totalSubscribe === 0 && this.timelineIsFiltered) {
          const timelineRange = this.timelineContributor.range;
          const detailedTimelineRange = this.detailedTimelineContributor.range;
          if (timelineRange && detailedTimelineRange) {
            this.showDetailedTimeline = ((detailedTimelineRange.max - detailedTimelineRange.min) <=
              (0.2 * (timelineRange.max - timelineRange.min)));
            this.timelineHistogramComponent.histogram.histogramParams.chartHeight = (this.showDetailedTimeline) ?
              this.detailedTimelineComponent.input.chartHeight : this.timelineComponent.input.chartHeight;
            this.timelineHistogramComponent.resizeHistogram();
            if (this.applicationFirstLoad) {
              // Sets current selection of detailed timeline
              const select =  this.timelineContributor.intervalSelection;
              this.detailedTimelineIntervalSelection = { startvalue: select.startvalue, endvalue: select.endvalue };
              this.applicationFirstLoad = false;
            }
          } else {
            this.showDetailedTimeline = false;
            this.timelineHistogramComponent.histogram.histogramParams.chartHeight = this.timelineComponent.input.chartHeight;
            this.timelineHistogramComponent.resizeHistogram();
          }
        }
      });
  }

  private resetHistogramsInputs(inputs: any) {
    Object.keys(inputs).forEach(key => {
      if (key === 'chartType') {
        inputs[key] = ChartType[inputs[key]];
      } else if (key === 'dataType') {
        inputs[key] = DataType[inputs[key]];
      } else if (key === 'xAxisPosition') {
        inputs[key] = Position[inputs[key]];
      } else if (key === 'descriptionPosition') {
        inputs = Position[inputs[key]];
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
  public HIDE_SHOW = 'Show';

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
        this.shortcutLabel = this.timelineContributor.timeLabel;
        this.timeShortcutsMap = this.groupBy(this.timeShortcuts, shortcut => shortcut.type);
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
      if (this.showShortcuts) {
        this.HIDE_SHOW = 'Hide';
      } else {
        this.HIDE_SHOW = 'Show';
      }
    }
  }

  public removeTimelineCollaboration(): void {
    this.showRemoveIcon = false;
    this.arlasCollaborativesearchService.removeFilter(this.timelineComponent.contributorId);

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

@Pipe({name: 'getLabel'})
export class LabelPipe implements PipeTransform {
  public transform(label: string, format: string): string {
    if (label) {
      const startEndValues = label.split('to');
      if (startEndValues.length > 1) {
        const start = new Date(+startEndValues[0]);
        const end = new Date(+startEndValues[1]);
        if (format) {
          const timeFormat = d3.utcFormat(format);
          return (timeFormat(start) + ' to ' + timeFormat(end));
        } else {
          return start.toUTCString().split(',')[1].replace('GMT', '') + ' to '
          + end.toUTCString().split(',')[1].replace('GMT', '');
        }
      } else {
        return label;
      }
    } else {
      return label;
    }
  }
}
