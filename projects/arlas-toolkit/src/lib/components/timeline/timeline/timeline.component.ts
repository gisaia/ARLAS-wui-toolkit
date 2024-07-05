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

import { Component, Input, OnInit, ViewChild, ChangeDetectorRef, ElementRef, Output, EventEmitter, OnDestroy } from '@angular/core';
import { HistogramContributor, DetailedHistogramContributor } from 'arlas-web-contributors';
import { OperationEnum } from 'arlas-web-core';
import { ArlasCollaborativesearchService, ArlasStartupService } from '../../../services/startup/startup.service';
import { SelectedOutputValues } from 'arlas-web-contributors/models/models';
import { ChartType, DataType, Position, HistogramTooltip } from 'arlas-d3';
import { ArlasColorService, HistogramComponent } from 'arlas-web-components';
import { filter, take, takeUntil } from 'rxjs/operators';
import { CollectionLegend, TimelineConfiguration } from './timeline.utils';
import { ArlasOverlayService } from '../../../services/overlays/overlay.service';
import { ArlasOverlayRef, CollectionUnit, getCollectionUnit } from '../../../tools/utils';
import { Subject } from 'rxjs';


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
export class TimelineComponent implements OnInit, OnDestroy {

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
   * @Input : Angular
   * @description Whether or not the spinner is displayed when loading data
   */
  @Input() public showSpinner = false;

  /**
   * @Input : Angular
   * @description Color palette of the spinner when loading data
   */
  @Input() public colorSpinner = 'primary';

  /**
   * @Input : Angular
   * @description Diameter of the spinner when loading data
   */
  @Input() public diameterSpinner = 100;

  /**
   * @Input : Angular
   * @description Stroke of the spinner when loading data
   */
  @Input() public strokeWidthSpinner = 5;

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
  public mainCollection: string;

  private _onDestroy$ = new Subject<boolean>();

  public constructor(protected arlasCollaborativesearchService: ArlasCollaborativesearchService, private cdr: ChangeDetectorRef,
    private arlasStartupService: ArlasStartupService, private arlasOverlayService: ArlasOverlayService,
    private arlasColorService: ArlasColorService) {
  }

  public ngOnInit() {
    if (this.timelineComponent) {
      this.timelineContributor = <HistogramContributor>this.arlasStartupService.contributorRegistry
        .get(this.timelineComponent.contributorId);
      this.timelineContributor.updateData = true;
      this.mainCollection = this.timelineContributor.collection;
      this.resetHistogramsInputs(this.timelineComponent.input);
      this.timelineLegend.push({
        collection: this.mainCollection,
        display_name: getCollectionUnit(this.units, this.mainCollection),
        color: this.arlasColorService.getColor(this.mainCollection),
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
            main: (ac.collectionName === this.mainCollection)
          });
        });
      }

      this.timelineContributor.chartDataEvent
        .pipe(takeUntil(this._onDestroy$))
        .subscribe(chartData => {
          this.timelineData = chartData.filter(cd => {
            const collectionLegend = this.timelineLegend.find(t => t.collection === cd.chartId);
            return !!collectionLegend && collectionLegend.active;
          });

          // Set timeline contributor's data to reflect selection of legend
          this.timelineContributor.setSelection(this.timelineData,
            this.arlasCollaborativesearchService.collaborations.get(this.timelineContributor.identifier));
        });

      if (this.detailedTimelineComponent) {
        this.detailedTimelineComponent.input.chartHeight = 76;
        this.resetHistogramsInputs(this.detailedTimelineComponent.input);
        this.detailedTimelineContributor = <DetailedHistogramContributor>this.arlasStartupService.contributorRegistry
          .get(this.detailedTimelineComponent.contributorId);
        this.detailedTimelineContributor.updateData = false;

        this.showDetailedTimelineOnCollaborationEnd();
      }
    }
  }

  public ngOnDestroy(): void {
    this._onDestroy$.next(true);
    this._onDestroy$.complete();
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
    // Once we bruch the main timeline, we want the detailed one to be able to pick up collaborations again
    if (!!this.detailedTimelineContributor) {
      this.detailedTimelineContributor.updateData = true;
    }
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

  /**
   * At the end of the collaboration of the Timeline Contributor, hides the timeline if the collaboration removed the filter.
   * If it added one, then asks the Detailed Timeline Contributor to update its data, to then check if the detailed timeline should display.
   */
  private showDetailedTimelineOnCollaborationEnd(): void {
    this.detailedTimelineContributor.chartDataEvent
      .pipe(takeUntil(this._onDestroy$))
      .subscribe(chartData => {
        this.detailedTimelineData = chartData.filter(cd => {
          const collectionLegend = this.timelineLegend.find(t => t.collection === cd.chartId);
          return !!collectionLegend && collectionLegend.active;
        });
        this.hideShowDetailedTimeline();
      });

    this.timelineContributor.endCollaborationEvent
      .pipe(takeUntil(this._onDestroy$))
      .subscribe(c => {
        if (c.operation === OperationEnum.remove) {
          this.timelineIsFiltered = false;
          this.hideDetailedTimeline();
        } else if (c.operation === OperationEnum.add) {
          this.timelineIsFiltered = this.arlasCollaborativesearchService.
            collaborations.has(this.timelineComponent.contributorId);
          if (this.timelineIsFiltered) {
            this.detailedTimelineContributor.updateData = true;
            this.detailedTimelineContributor.updateFromCollaboration(c);
          }
        }
      });
  }

  /**
   * On the event sent by the timeline-tools, remove the timeline collaboration and hide the detailed timeline
   */
  protected onRemoveCollaboration() {
    this.arlasCollaborativesearchService.removeFilter(this.timelineComponent.contributorId);
    this.timelineIsFiltered = false;
    this.hideDetailedTimeline();
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
    if (!!this.timelineContributor && this.timelineContributor.chartData?.length > 1) {
      const d = this.timelineContributor.chartData;
      const l = d.length;
      timelineRange = (+d[l - 1].key) - (+d[0].key);
    }
    let detailedTimelineRange = this.detailedTimelineContributor.range;
    if (!!this.detailedTimelineContributor && this.detailedTimelineContributor.chartData?.length > 1) {
      const d = this.detailedTimelineContributor.chartData;
      const l = d.length;
      detailedTimelineRange = (+d[l - 1].key) - (+d[0].key);
    }
    // In case if the timeline is hidden
    if (!!this.timelineHistogramComponent) {
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
        if (this.showDetailedTimeline && !!this.detailedTimelineHistogramComponent) {
          this.detailedTimelineHistogramComponent.resizeHistogram();
        }
      } else {
        this.hideDetailedTimeline();
      }
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
    if (!!this.timelineHistogramComponent) {
      this.timelineHistogramComponent.histogram.histogramParams.chartHeight = this.timelineComponent.input.chartHeight;
      this.timelineHistogramComponent.resizeHistogram();
    }
  }
}
