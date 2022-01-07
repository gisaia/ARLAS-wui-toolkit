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

import { Component, Input, OnInit, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
import { HistogramContributor, DetailedHistogramContributor } from 'arlas-web-contributors';
import { OperationEnum } from 'arlas-web-core';
import { ArlasCollaborativesearchService, ArlasStartupService } from '../../../services/startup/startup.service';
import { SelectedOutputValues } from 'arlas-web-contributors/models/models';
import { ChartType, DataType, Position, HistogramTooltip } from 'arlas-d3';
import { HistogramComponent } from 'arlas-web-components';
import { filter } from 'rxjs/operators';
import { CollectionLegend, TimelineConfiguration } from './timeline.utils';
import { ArlasOverlayService } from '../../../services/overlays/overlay.service';
import { ArlasOverlayRef } from '../../../tools/utils';
import { ArlasColorGeneratorLoader } from '../../../services/color-generator-loader/color-generator-loader.service';


/**
 * This component contains
 * - A main timeline histogram that plots the count (or other metric) of data over time
 * - A detailed timeline histogram that plots the current selection on the main timeline (optional)
 * - A datepicker (optional)
 * - Shortcut labels that allow to apply predefined temporal filters (Last year, Last month, Today, etc ...)
 */
@Component({
  selector: 'arlas-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {

  /**
   * @Input : Angular
   * @description In this object, all the necessary inputs of HistogramComponent (ARLAS-web-components)
   * must be set as well as the identifier of the contributor that fetches timeline data. The `HistogramContributor`
   * should be declared before in the `contributorRegistry` of `ArlasStartupService`
   */
  @Input() public timelineComponent: TimelineConfiguration;
  /**
   * @Input : Angular
   * @description Optional input. If not set, the detailed timeline is deactivated.
   * Same as the precedent input, In this object, all the necessary inputs of HistogramComponent (ARLAS-web-components)
   * must be set as well as the identifier of the detailed contributor that fetches data within the current selection.
   * The `DetailedHistogramContributor` should be declared before in the `contributorRegistry` of `ArlasStartupService`
   */
  @Input() public detailedTimelineComponent: TimelineConfiguration;
  /**
   * @Input : Angular
   * @description Whether the date picker is enabled
   */
  @Input() public activeDatePicker = false;
  @ViewChild('timeline', { static: false }) public timelineHistogramComponent: HistogramComponent;
  @ViewChild('detailedtimeline', { static: false }) public detailedTimelineHistogramComponent: HistogramComponent;

  public showDetailedTimeline = false;
  public detailedTimelineContributor: DetailedHistogramContributor;
  public timelineContributor: HistogramContributor;
  public detailedTimelineIntervalSelection: SelectedOutputValues;
  public timelineData = [];
  public detailedTimelineData = [];
  private isDetailedIntervalBrushed = false;
  private applicationFirstLoad = false;
  private timelineIsFiltered = false;
  public timelineOverlayRef: ArlasOverlayRef;
  public timelineLegend: CollectionLegend[] = [];
  public mainCollection;

  public constructor(private arlasCollaborativesearchService: ArlasCollaborativesearchService, private cdr: ChangeDetectorRef,
    private arlasStartupService: ArlasStartupService, private arlasOverlayService: ArlasOverlayService,
    private arlasColorService: ArlasColorGeneratorLoader) {
  }

  public ngOnInit() {
    if (this.timelineComponent && this.detailedTimelineComponent) {
      this.resetHistogramsInputs(this.timelineComponent.input);
      this.detailedTimelineComponent.input.chartHeight = 75;
      this.resetHistogramsInputs(this.detailedTimelineComponent.input);
      this.detailedTimelineContributor = <DetailedHistogramContributor>this.arlasStartupService.contributorRegistry
        .get(this.detailedTimelineComponent.contributorId);
      this.timelineContributor = <HistogramContributor>this.arlasStartupService.contributorRegistry
        .get(this.timelineComponent.contributorId);

      const mainCollection = this.timelineContributor.collection;
      this.mainCollection = mainCollection;
      this.timelineLegend.push({
        collection: mainCollection,
        color: this.arlasColorService.getColor(mainCollection),
        active: true,
        main: true
      });

      if (!!this.timelineContributor.additionalCollections) {
        this.timelineContributor.additionalCollections.forEach(ac => {
          this.timelineLegend.push({
            collection: ac.collectionName,
            color: this.arlasColorService.getColor(ac.collectionName),
            active: true,
            main: (ac.collectionName === mainCollection)
          });
        });
      }

      this.timelineContributor.chartDataEvent.subscribe(chartData => {
        this.timelineData = chartData.filter(cd => {
          const collectionLegend = this.timelineLegend.find(t => t.collection === cd.chartId);
          return !!collectionLegend && collectionLegend.active;
        });

      });

      this.timelineContributor.endCollaborationEvent.subscribe(() => {
        this.timelineContributor.setSelection(this.timelineData,
          this.arlasCollaborativesearchService.collaborations.get(this.timelineContributor.identifier));
      });

      this.detailedTimelineContributor.chartDataEvent.subscribe(chartData => {
        this.detailedTimelineData = chartData.filter(cd => {
          const collectionLegend = this.timelineLegend.find(t => t.collection === cd.chartId);
          return !!collectionLegend && collectionLegend.active;
        });
      });
      this.showDetailedTimelineOnCollaborationEnd();
    } else if (this.timelineComponent) {
      this.resetHistogramsInputs(this.timelineComponent.input);
      this.timelineContributor = <HistogramContributor>this.arlasStartupService.contributorRegistry
        .get(this.timelineComponent.contributorId);

      const mainCollection = this.timelineContributor.collection;
      this.timelineLegend.push({
        collection: mainCollection,
        color: this.arlasColorService.getColor(mainCollection),
        active: true,
        main: true
      });
      if (!!this.timelineContributor.additionalCollections) {
        this.timelineContributor.additionalCollections.forEach(ac => {
          this.timelineLegend.push({
            collection: ac.collectionName,
            color: this.arlasColorService.getColor(ac.collectionName),
            active: true,
            main: (ac.collectionName === mainCollection)
          });
        });
      }
      this.timelineContributor.chartDataEvent.subscribe(chartData => {
        this.timelineData = chartData.filter(cd => {
          const collectionLegend = this.timelineLegend.find(t => t.collection === cd.chartId);
          return !!collectionLegend && collectionLegend.active;
        });
      });
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
   * Runs when the selection is brushed on main timeline.
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

  public showHistogramTooltip(tooltip: HistogramTooltip, e: ElementRef, xOffset: number, yOffset: number, right: boolean) {
    if (!!this.timelineOverlayRef) {
      this.timelineOverlayRef.close();
    }
    if (!!tooltip && tooltip.shown) {
      this.timelineOverlayRef = this.arlasOverlayService.openHistogramTooltip({ data: tooltip }, e, xOffset, yOffset, right);
    }
  }

  public hideHistogramTooltip() {
    if (!!this.timelineOverlayRef) {
      this.timelineOverlayRef.close();
    }
  }

  public emitTooltip(tooltip: HistogramTooltip, e: ElementRef) {
    const yOffset = -80;
    let xOffset = tooltip.xPosition;
    let right = false;
    if (!!tooltip && tooltip.shown && tooltip.xPosition > tooltip.chartWidth / 2) {
      xOffset = -tooltip.chartWidth + tooltip.xPosition;
      right = true;
    }
    this.showHistogramTooltip(tooltip, e, xOffset, yOffset, right);
  }

  public hideShowCollection(collectionLegend: CollectionLegend): void {
    collectionLegend.active = !collectionLegend.active;
    this.timelineData = this.timelineContributor.chartData.filter(cd => {
      const collectionLegend = this.timelineLegend.find(t => t.collection === cd.chartId);
      return !!collectionLegend && collectionLegend.active;

    });
    this.timelineContributor.setSelection(this.timelineData,
      this.arlasCollaborativesearchService.collaborations.get(this.timelineContributor.identifier));

    if (!!this.detailedTimelineContributor) {
      this.detailedTimelineData = this.detailedTimelineContributor.chartData.filter(cd => {
        const collectionLegend = this.timelineLegend.find(t => t.collection === cd.chartId);
        return !!collectionLegend && collectionLegend.active;
      });
      /** hide detailed timeline if there is no data displayed because of hiding collections */
      if (!!this.detailedTimelineData) {
        if (this.detailedTimelineData.length === 0) {
          this.showDetailedTimeline = false;
          this.timelineHistogramComponent.histogram.histogramParams.chartHeight = this.timelineComponent.input.chartHeight;
          this.timelineHistogramComponent.resizeHistogram();
        } else {
          this.hideShowDetailedTimeline();
        }
      }
    }
  }

  private showDetailedTimelineOnCollaborationEnd(): void {
    this.arlasCollaborativesearchService.collaborationBus.pipe(filter(c => ((this.timelineComponent
      && c.id === this.timelineComponent.contributorId) || c.all)))
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
        if (!!this.detailedTimelineContributor && !!this.detailedTimelineData) {
          if (this.detailedTimelineData.length === 0) {
            this.showDetailedTimeline = false;
            this.timelineHistogramComponent.histogram.histogramParams.chartHeight = this.timelineComponent.input.chartHeight;
            this.timelineHistogramComponent.resizeHistogram();
          } else {
            this.hideShowDetailedTimeline();
          }
        } else {
          this.hideShowDetailedTimeline();

        }
      }
    });
  }

  private hideShowDetailedTimeline() {

    let timelineRange = this.timelineContributor.range;
    if (!!this.timelineContributor && this.timelineContributor.chartData) {
      const d = this.timelineContributor.chartData;
      const l = d.length;
      timelineRange = (+d[l - 1].key) - (+d[0].key);
    }
    let detailedTimelineRange = this.detailedTimelineContributor.range;
    if (!!this.detailedTimelineContributor && this.detailedTimelineContributor.chartData) {
      const d = this.detailedTimelineContributor.chartData;
      const l = d.length;
      detailedTimelineRange = (+d[l - 1].key) - (+d[0].key);
    }

    if (timelineRange !== undefined && detailedTimelineRange !== undefined) {
      const intervalSelection = (+this.timelineContributor.intervalSelection.endvalue -
        +this.timelineContributor.intervalSelection.startvalue);
      const intervalSelectionCondition = intervalSelection <= 0.2 * timelineRange;
      this.showDetailedTimeline = (detailedTimelineRange <= 0.2 * timelineRange) && intervalSelectionCondition;
      this.timelineHistogramComponent.histogram.histogramParams.chartHeight = (this.showDetailedTimeline) ?
        45 : this.timelineComponent.input.chartHeight;
      this.timelineHistogramComponent.histogram.histogramParams.yTicks = (this.showDetailedTimeline) ?
        1 : this.timelineComponent.input.yTicks;
      this.timelineHistogramComponent.histogram.histogramParams.yLabels = (this.showDetailedTimeline) ?
        1 : this.timelineComponent.input.yLabels;
      this.timelineHistogramComponent.histogram.histogramParams.showHorizontalLines = (this.showDetailedTimeline) ?
        false : this.timelineComponent.input.showHorizontalLines;
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
