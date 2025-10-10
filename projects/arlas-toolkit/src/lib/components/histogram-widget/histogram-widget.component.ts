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

import {
  AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter,
  Input, OnDestroy, OnInit, Output, ViewChild
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DataType, HistogramComponent, HistogramTooltip } from 'arlas-web-components';
import { DetailedHistogramContributor, HistogramContributor } from 'arlas-web-contributors';
import { SelectedOutputValues } from 'arlas-web-contributors/models/models';
import { OperationEnum } from 'arlas-web-core';
import { Subject, filter, takeUntil } from 'rxjs';
import { ArlasCollaborativesearchService } from '../../services/collaborative-search/arlas.collaborative-search.service';
import { ArlasExportCsvService } from '../../services/export-csv/export-csv.service';
import { ArlasOverlayService } from '../../services/overlays/overlay.service';
import { ArlasConfigService } from '../../services/startup/startup.service';
import { WidgetNotifierService } from '../../services/widget/widget.notifier.service';
import { ArlasOverlayRef, SpinnerOptions } from '../../tools/utils';
import { DEFAULT_SPINNER_OPTIONS } from '../progress-spinner/progress-spinner.component';
import { computeChartTooltipOffset } from './utils';


/**
 * A Widget wraps a component from ARLAS-web-components and bind it to its contributor. The component has thus input data to plot.
 * Note: This component is binded to ARLAS-wui configuration
 */
@Component({
  selector: 'arlas-tool-histogram-widget',
  templateUrl: './histogram-widget.component.html',
  styleUrls: ['./histogram-widget.component.css']
})
export class HistogramWidgetComponent implements OnInit, OnDestroy, AfterViewInit {

  public showDetailedHistogram = false;
  public detailedContributor: DetailedHistogramContributor;
  public detailedTimelineIntervalSelection: SelectedOutputValues;
  public showSpinner = false;
  private histogramIsFiltered = false;
  private applicationFirstLoad = false;
  private isDetailedIntervalBrushed = false;

  public tooltipEvent: Subject<HistogramTooltip> = new Subject<HistogramTooltip>();

  public histogramOverlayRef: ArlasOverlayRef;

  @Input() public contributor: HistogramContributor;
  @Input() public componentInputs;
  /**
   * @Input : Angular
   * @description Whether we dispylay the export csv button
   */
  @Input() public showExportCsv = false;
  /**
   * @Input : Angular
   * @description Position of the widget in the group
   */
  @Input() public position: number;

  /**
   * @Input : Angular
   * @description Number of widgets in the group to whom this widget belongs
   */
  @Input() public groupLength: number;

  /**
   * @Input : Angular
   * @description Spinner options
   */
  @Input() public spinnerOptions: SpinnerOptions = DEFAULT_SPINNER_OPTIONS;

  /**
   * @Input : Angular
   * @description Whether to display a detailed histogram
   */
  @Input() public noDetail: boolean;

  @Output() public exportCsvEvent: Subject<{ contributor: HistogramContributor; type: string; firstLevel: boolean; }> = new Subject();



  /**
   * @Output : Angular
   * @description Emits an output that comes from the component (ARLAS-web-components). The emitted output has information about
   * the `origin` which is the contributor id of the component; `event` the name of the event; and eventually `data` which contains
   * the emitted data from the component.
   */
  @Output() public outEvents: Subject<{ origin: string; event: string; data?: any; }>
    = new Subject<{ origin: string; event: string; data?: any; }>();

  @Output() public currentInterval: EventEmitter<string> = new EventEmitter();

  @ViewChild('histogram', { static: false }) public histogramComponent: HistogramComponent;
  @ViewChild('detailedhistogram', { static: false }) public detailedHistogramComponent: HistogramComponent;

  private _onDestroy$ = new Subject<boolean>();

  public constructor(
    protected arlasCollaborativesearchService: ArlasCollaborativesearchService,
    private readonly arlasConfigurationService: ArlasConfigService,
    private readonly cdr: ChangeDetectorRef,
    public translate: TranslateService,
    public arlasExportCsvService: ArlasExportCsvService,
    private readonly arlasOverlayService: ArlasOverlayService,
    public widgetNotifier: WidgetNotifierService
  ) { }

  public initDetailedContributor() {
    if (!!this.contributor) {
      this.detailedContributor = new DetailedHistogramContributor(
        this.contributor.collection + '-'
        + this.contributor.identifier + '-arlas__detailed',
        this.arlasCollaborativesearchService, this.arlasConfigurationService, this.contributor.collection, false);
      this.contributor.detailedHistrogramContributor = this.detailedContributor;
      this.detailedContributor.updateData = false;
      this.detailedContributor.range = undefined;
      this.detailedContributor.annexedContributorId = this.contributor.identifier;
      this.detailedContributor.useUtc = this.contributor.useUtc;
      this.detailedContributor.selectionExtentPercentage = 0.02;
      const detailedNbBuckets = !!this.contributor.getNbBuckets() ? this.contributor.getNbBuckets() : 50;
      this.detailedContributor.setNbBuckets(detailedNbBuckets);
      this.detailedContributor.setName(this.contributor.getName() + '__detailed');
      this.detailedContributor.init(this.contributor.getAggregations(), this.contributor.getField(),
        this.contributor.getJsonPath(), this.contributor.additionalCollections);
    }
  }

  public ngOnInit() {
    if (!this.noDetail) {
      this.initDetailedContributor();
      this.showDetailedHistogramOnCollaborationEnd();
    }
  }

  public ngAfterViewInit() {
    this.checkDisplayDetailedHistogram();
  }

  public ngOnDestroy() {
    this.tooltipEvent.complete();
    this.tooltipEvent.unsubscribe();

    this.exportCsvEvent.complete();
    this.exportCsvEvent.unsubscribe();

    this._onDestroy$.next(true);
    this._onDestroy$.complete();
  }

  public exportCsv(contributor: HistogramContributor) {
    this.exportCsvEvent.next({
      contributor,
      type: 'histogram',
      firstLevel: false
    });
  }

  /**
   * Recalculates the new data of detailed histogram and resets its own current selection.
   * @param selections List containing only the current selection of detailed histogram
   */
  public onDetailedIntervalBrushed(selections: SelectedOutputValues[]): void {
    this.showSpinner = true;
    this.isDetailedIntervalBrushed = true;
    this.detailedTimelineIntervalSelection = { startvalue: selections[0].startvalue, endvalue: selections[0].endvalue };
    this.contributor.valueChanged(this.contributor.intervalListSelection.concat(selections));
  }


  /** When the main histogram selection is brushed
   * Hide the detailed histogram if the selection range is greater than 20% of the histogram range
   */
  public onMainIntervalBrushed(event) {
    const histogramRange = this.contributor.range;
    const selection = event[event.length - 1];
    if (histogramRange && !!selection) {
      const detailedHistogramRange = (+selection.endvalue - +selection.startvalue);
      this.showDetailedHistogram = !this.noDetail && (detailedHistogramRange <= 0.2 * histogramRange);
      this.resizeMainHistogram();
      if (!!this.detailedContributor) {
        this.detailedContributor.updateData = this.showDetailedHistogram;
      }
    }
    this.contributor.valueChanged(event);
    this.showSpinner = this.showDetailedHistogram;
  }

  /** reposition interval of the main histogram after the detail histogram finishes plotting */
  public afterDetailedDataPlotted(e: string) {
    if (this.detailedContributor) {
      if (this.isDetailedIntervalBrushed) {  // If detailed histogram is replotted after moving its own brush.
        // Reset current selection of detailed histogram after it is plotted
        this.detailedTimelineIntervalSelection = {
          startvalue: this.detailedContributor.currentSelectedInterval.startvalue,
          endvalue: this.detailedContributor.currentSelectedInterval.endvalue
        };
        // Apply the current selection of detailed histogram on the main histogram
        this.contributor.intervalSelection = {
          startvalue: this.detailedContributor.currentSelectedInterval.startvalue,
          endvalue: this.detailedContributor.currentSelectedInterval.endvalue
        };
      } else { // If detailed histogram is replotted after moving the brush of the main histogram or when the app is loaded.
        const selection = this.detailedContributor.currentSelectedInterval;
        if (selection) {
          this.detailedTimelineIntervalSelection = { startvalue: selection.startvalue, endvalue: selection.endvalue };
        } else {
          this.applicationFirstLoad = true;
        }
      }
      this.isDetailedIntervalBrushed = false;
      this.cdr.detectChanges();
    }
  }

  public showHistogramTooltip(tooltip: HistogramTooltip, e: ElementRef, xOffset: number, yOffset: number) {
    if (this.histogramOverlayRef) {
      this.histogramOverlayRef.close();
    }
    if (tooltip?.shown) {
      this.histogramOverlayRef = this.arlasOverlayService.openHistogramTooltip({ data: tooltip }, e, xOffset, yOffset, false);
    }
  }

  public hideHistogramTooltip() {
    if (this.histogramOverlayRef) {
      this.histogramOverlayRef.close();
    }
  }

  public emitTooltip(tooltip: HistogramTooltip, e: ElementRef, detailed: boolean) {
    const { xOffset, yOffset } = computeChartTooltipOffset(
      this.componentInputs.chartWidth, this.groupLength, this.position, this.contributor.identifier, detailed);
    this.showHistogramTooltip(tooltip, e, xOffset, yOffset);
  }

  private resizeMainHistogram() {
    this.histogramComponent.histogram.histogramParams.chartHeight = this.showDetailedHistogram ?
      this.componentInputs.chartHeight * 0.5 : this.componentInputs.chartHeight;
    this.histogramComponent.histogram.histogramParams.yLabels = this.showDetailedHistogram ? 2 : this.componentInputs.yLabels;
    this.histogramComponent.resizeHistogram();
  }

  /** show detailed histogram if selection range is less than 20% of the main histogram range */
  private showDetailedHistogramOnCollaborationEnd(): void {
    this.arlasCollaborativesearchService.collaborationBus.pipe(filter(c => ((!!this.contributor && this.histogramComponent
      && c.id === this.contributor.identifier) || c.all)), takeUntil(this._onDestroy$))
      .subscribe(c => {
        if (c.operation === OperationEnum.remove) {
          this.histogramIsFiltered = false;
          this.hideDetailedHistogram();
          this.histogramComponent.histogram.histogramParams.chartHeight = this.componentInputs.chartHeight;
          this.histogramComponent.resizeHistogram();
        } else if (c.operation === OperationEnum.add) {
          this.histogramIsFiltered = true;
          let left = this.histogramComponent.histogram.histogramParams.startValue;
          let right = this.histogramComponent.histogram.histogramParams.endValue;
          if (this.histogramComponent.dataType === DataType.time) {
            this.currentInterval.emit(`${left} - ${right}`);
          } else {
            if (this.histogramComponent.xUnit) {
              left = left + ' ' + this.histogramComponent.xUnit;
              right = right + ' ' + this.histogramComponent.xUnit;
            }
            this.currentInterval.emit(`${left} - ${right}`);
          }
          this.checkDisplayDetailedHistogram();
        }
      });

    this.arlasCollaborativesearchService.ongoingSubscribe.pipe(takeUntil(this._onDestroy$)).subscribe(nb => {
      if (this.arlasCollaborativesearchService.totalSubscribe === 0 && this.histogramIsFiltered) {
        this.checkDisplayDetailedHistogram();
      }
    });
  }

  /**
   * Based on the extent of the selection of the histogram, checks whether the detailed histogram should be displayed.
   * If so, resizes the histograms and fetches data if no data is present for the detailed histogram.
   * Otherwise, hides the detailed histogram, and resizes the main one.
   */
  private checkDisplayDetailedHistogram() {
    const histogramRange = this.contributor?.range;
    this.showSpinner = false;
    const selection = this.contributor?.intervalSelection;
    if (histogramRange && !!selection) {
      const detailedHistogramRange = (+selection.endvalue - +selection.startvalue);
      this.showDetailedHistogram = (detailedHistogramRange <= 0.2 * histogramRange);
      this.resizeMainHistogram();
      if (this.showDetailedHistogram) {
        this.histogramComponent.histogram.histogramParams.topOffsetRemoveInterval = 0;
        if (!this.detailedContributor) {
          this.initDetailedContributor();
        }
        this.detailedContributor.updateData = true;
        /** If no data has been fetched previously in the detailed contributor, then the range is necessarily undefined
         * Which means we should trigger the collaboration of th
         */
        if (this.detailedContributor.range === undefined || this.detailedContributor.range === null) {
          // Simulate a collaboration event that will result in a fetchData
          this.detailedContributor.updateFromCollaboration({
            id: 'url',
            operation: OperationEnum.add,
            all: false
          });
        }

        if (this.detailedHistogramComponent) {
          this.detailedHistogramComponent.histogram.histogramParams.chartHeight = this.componentInputs.chartHeight;
          this.detailedHistogramComponent.resizeHistogram();
        }
      } else {
        this.hideDetailedHistogram();
      }
      if (this.applicationFirstLoad && !!this.detailedContributor && this.detailedContributor.currentSelectedInterval) {
        // Sets current selection of detailed histogram
        const select = this.detailedContributor.currentSelectedInterval;
        this.detailedTimelineIntervalSelection = { startvalue: select.startvalue, endvalue: select.endvalue };
        this.applicationFirstLoad = false;
      }
    } else {
      this.hideDetailedHistogram();
      this.histogramComponent.histogram.histogramParams.chartHeight = this.componentInputs.chartHeight;
      this.histogramComponent.resizeHistogram();
    }
  }

  private hideDetailedHistogram() {
    this.showDetailedHistogram = false;
    this.histogramComponent.histogram.histogramParams.topOffsetRemoveInterval = this.componentInputs.topOffsetRemoveInterval;
    if (!!this.detailedContributor) {
      this.detailedContributor.updateData = false;
      this.detailedContributor.range = undefined;
    }
  }
}
