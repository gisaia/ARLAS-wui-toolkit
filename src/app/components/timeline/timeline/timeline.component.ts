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

import { Component, Input, OnInit, ViewChild, ChangeDetectorRef} from '@angular/core';
import { HistogramContributor, DetailedHistogramContributor } from 'arlas-web-contributors';
import { OperationEnum } from 'arlas-web-core';
import { ArlasCollaborativesearchService, ArlasStartupService } from './../../../services/startup/startup.service';
import { StringifiedTimeShortcut, SelectedOutputValues } from 'arlas-web-contributors/models/models';
import { utcFormat } from 'd3-time-format';
import { TranslateService } from '@ngx-translate/core';
import { ChartType, DataType, Position } from 'arlas-d3';
import { HistogramComponent } from 'arlas-web-components';
import { filter } from 'rxjs/internal/operators/filter';

@Component({
  selector: 'arlas-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {

  @Input() public detailedTimelineComponent: any;
  @Input() public timelineComponent: any;
  @Input() public activeDatePicker = false;
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
    this.detailedTimelineIntervalSelection = { startvalue: selections[0].startvalue, endvalue: selections[0].endvalue };
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
  public afterDetailedDataPlotted(e) {
    if (this.isDetailedIntervalBrushed) {  // If detailed timeline is replotted after moving its own brush.
      // Reset current selection of detailed timeline after it is plotted
      this.detailedTimelineIntervalSelection = {
        startvalue: this.detailedTimelineContributor.currentSelectedInterval.startvalue,
        endvalue: this.detailedTimelineContributor.currentSelectedInterval.endvalue
      };
      // Apply the current selection of detailed timeline on the main timeline
      this.timelineContributor.intervalSelection = {
        startvalue: this.detailedTimelineContributor.currentSelectedInterval.startvalue,
        endvalue: this.detailedTimelineContributor.currentSelectedInterval.endvalue
      };
    } else { // If detailed timeline is replotted after moving the brush of the main timeline or when the app is loaded.
      const selection = this.detailedTimelineContributor.currentSelectedInterval;
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
    this.arlasCollaborativesearchService.collaborationBus.pipe(filter(c => (c.id === this.timelineComponent.contributorId || c.all)))
      .subscribe(c => {
        if (c.operation === OperationEnum.remove) {
          this.timelineIsFiltered = false;
          this.showDetailedTimeline = false;
          this.timelineHistogramComponent.histogram.histogramParams.chartHeight = this.timelineComponent.input.chartHeight;
          this.timelineHistogramComponent.resizeHistogram();
        } else if (c.operation === OperationEnum.add) {
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
          if (this.applicationFirstLoad && this.detailedTimelineContributor.currentSelectedInterval) {
            // Sets current selection of detailed timeline
            const select = this.detailedTimelineContributor.currentSelectedInterval;
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
