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

import { Component, Input, OnInit, ViewChild, ChangeDetectorRef, ElementRef, Output, EventEmitter } from '@angular/core';
import { HistogramContributor, DetailedHistogramContributor } from 'arlas-web-contributors';
import { OperationEnum } from 'arlas-web-core';
import { ArlasCollaborativesearchService, ArlasStartupService } from '../../../services/startup/startup.service';
import { SelectedOutputValues } from 'arlas-web-contributors/models/models';
import { ChartType, DataType, Position, HistogramTooltip } from 'arlas-d3';
import { ArlasColorService, HistogramComponent } from 'arlas-web-components';
import { filter } from 'rxjs/operators';
import { CollectionLegend, TimelineConfiguration } from './timeline.utils';
import { ArlasOverlayService } from '../../../services/overlays/overlay.service';
import { ArlasOverlayRef, CollectionUnit, getCollectionUnit } from '../../../tools/utils';


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
  styleUrls: ['./timeline.component.scss']
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

  /**
   * @Input : Angular
   * @description Units to use as display names for the timeline legend
   */
  @Input() public units: Array<CollectionUnit> = new Array();

  /**
   * @Input : Angular
   * @description Whether to display the timelines' histogram
   */
  @Input() public isDisplayHistogram = true;

  /**
   * @Output : Angular
   * @description Emits when the value of isDisplayHistogram changes
   */
  @Output() public isDisplayHistogramChange: EventEmitter<boolean> = new EventEmitter();

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
    private arlasColorService: ArlasColorService) {
  }

  public ngOnInit() {
    if (this.timelineComponent) {
      this.timelineContributor = <HistogramContributor>this.arlasStartupService.contributorRegistry
        .get(this.timelineComponent.contributorId);
      this.timelineContributor.updateData = true;
      const mainCollection = this.timelineContributor.collection;
      this.mainCollection = mainCollection;
      this.resetHistogramsInputs(this.timelineComponent.input);
      this.timelineLegend.push({
        collection: mainCollection,
        display_name: getCollectionUnit(this.units, mainCollection),
        color: this.arlasColorService.getColor(mainCollection),
        active: true,
        main: true
      });
      if (!!this.timelineContributor.additionalCollections) {
        this.timelineContributor.additionalCollections.forEach(ac => {
          this.timelineLegend.push({
            collection: ac.collectionName,
            display_name: getCollectionUnit(this.units, ac.collectionName),
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
      if (this.detailedTimelineComponent) {
        this.detailedTimelineComponent.input.chartHeight = 76;
        this.resetHistogramsInputs(this.detailedTimelineComponent.input);
        this.detailedTimelineContributor = <DetailedHistogramContributor>this.arlasStartupService.contributorRegistry
          .get(this.detailedTimelineComponent.contributorId);
        this.detailedTimelineContributor.updateData = false;
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
      }
    }
  }

  /**
   * Recalculates the new data of detailed timeline and resets its own current selection.
   * @param selections List containing only the current selection of detailed timeline
   */
  public onDetailedIntervalBrushed(selections: SelectedOutputValues[]): void {
    this.isDetailedIntervalBrushed = true;
    this.detailedTimelineIntervalSelection = { startvalue: selections[0].startvalue, endvalue: selections[0].endvalue };
    this.timelineContributor.valueChanged(this.timelineContributor.intervalListSelection.concat(selections),
      this.timelineContributor.getAllCollections());
  }

  /**
   * Runs when the selection is brushed on main timeline.
   * @param selections List containing only the current selection of detailed timeline
   */
  public onTimelineIntervalBrushed(selections: SelectedOutputValues[]): void {
    this.timelineContributor.valueChanged(selections, this.timelineContributor.getAllCollections());
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
    const yOffset = this.timelineLegend && this.timelineLegend.length > 1 ? -140 : -110;
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
    const activeCollections = new Set(this.timelineLegend.filter(tl => tl.active).map(tl => tl.collection));
    this.timelineContributor.collections = this.timelineContributor.getAllCollections()
      .filter(c => activeCollections.has(c.collectionName));
    if (this.timelineContributor.collections.length === 0) {
      this.timelineData = this.timelineContributor.chartData = [];
      this.detailedTimelineData = this.detailedTimelineContributor.chartData = [];
      this.hideDetailedTimeline();
    } else {
      this.timelineContributor.updateFromCollaboration({
        id: '',
        all: false,
        operation: OperationEnum.add
      });
      if (this.detailedTimelineContributor) {
        this.detailedTimelineContributor.collections = this.timelineContributor.collections;
        this.detailedTimelineContributor.updateFromCollaboration({
          id: '',
          all: false,
          operation: OperationEnum.add
        });
      }
    }
  }

  private showDetailedTimelineOnCollaborationEnd(): void {
    this.arlasCollaborativesearchService.collaborationBus.pipe(filter(c => ((this.timelineComponent
      && c.id === this.timelineComponent.contributorId) || c.all)))
      .subscribe(c => {
        if (c.operation === OperationEnum.remove) {
          this.timelineIsFiltered = false;
          this.hideDetailedTimeline();
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
            this.hideDetailedTimeline();
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

  public toggleTimeline() {
    this.isDisplayHistogram = !this.isDisplayHistogram;
    this.isDisplayHistogramChange.next(this.isDisplayHistogram);
    // Disable the update of both normal and detailed timeline if not open
    this.timelineContributor.updateData = this.isDisplayHistogram;
    this.detailedTimelineContributor.updateData = this.showDetailedTimeline && this.isDisplayHistogram;
    if (this.isDisplayHistogram) {
      this.timelineContributor.updateFromCollaboration({
        id: this.timelineContributor.linkedContributorId,
        operation: OperationEnum.add,
        all: false
      });
      if (this.showDetailedTimeline) {
        this.detailedTimelineContributor.updateFromCollaboration({
          id: this.detailedTimelineContributor.linkedContributorId,
          operation: OperationEnum.add,
          all: false
        });
      }
    }
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
      this.detailedTimelineContributor.updateData = this.showDetailedTimeline;
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
      this.hideDetailedTimeline();
      this.timelineHistogramComponent.histogram.histogramParams.chartHeight = this.timelineComponent.input.chartHeight;
      this.timelineHistogramComponent.resizeHistogram();
    }
  }

  private resetHistogramsInputs(inputs: any) {
    Object.keys(inputs).forEach(key => {
      if (key === 'chartType' && isNaN(inputs[key])) {
        inputs[key] = ChartType[inputs[key]];
      } else if (key === 'dataType' && isNaN(inputs[key])) {
        inputs[key] = DataType[inputs[key]];
      } else if (key === 'xAxisPosition' && isNaN(inputs[key])) {
        inputs[key] = Position[inputs[key]];
      } else if (key === 'descriptionPosition' && isNaN(inputs[key])) {
        inputs = Position[inputs[key]];
      }
    });
  }

  private hideDetailedTimeline() {
    this.showDetailedTimeline = false;
    if (!!this.detailedTimelineContributor) {
      this.detailedTimelineContributor.updateData = false;
    }
  }
}
