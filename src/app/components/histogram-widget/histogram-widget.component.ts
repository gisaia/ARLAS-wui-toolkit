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

import { Component, OnInit, Input, ViewChild, ChangeDetectorRef, Output, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { ArlasCollaborativesearchService, ArlasConfigService } from '../../services/startup/startup.service';
import { HistogramComponent } from 'arlas-web-components';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { ArlasExportCsvService } from '../../services/export-csv/export-csv.service';
import { HistogramContributor, DetailedHistogramContributor } from 'arlas-web-contributors';
import { SelectedOutputValues } from 'arlas-web-contributors/models/models';
import { filter } from 'rxjs/operators';
import { OperationEnum } from 'arlas-web-core';
import { SpinnerOptions } from '../../tools/utils';


/**
 * A Widget wraps a component from ARLAS-web-components and bind it to its contributor. The component has thus input data to plot.
 * Note: This component is binded to ARLAS-wui configuration
 */
@Component({
  selector: 'arlas-tool-histogram-widget',
  templateUrl: './histogram-widget.component.html',
  styleUrls: ['./histogram-widget.component.css']
})
export class HistogramWidgetComponent implements OnInit {

  public showDetailedHistogram = false;
  public detailedContributor: DetailedHistogramContributor;
  public detailedTimelineIntervalSelection: SelectedOutputValues;
  public showSpinner = false;
  private histogramIsFiltered = false;
  private applicationFirstLoad = false;
  private isDetailedIntervalBrushed = false;

  @Input() public contributor: HistogramContributor;
  @Input() public componentInputs;
  /**
   * @Input : Angular
   * @description Whether we dispylay the export csv button
   */
  @Input() public showExportCsv = false;

  /**
   * @Input : Angular
   * @description Spinner options
   */
  @Input() public spinnerOptions: SpinnerOptions;

  @Output() public exportCsvEvent: Subject<{ contributor: HistogramContributor, type: string, firstLevel: boolean }> = new Subject();



  /**
   * @Output : Angular
   * @description Emits an output that comes from the component (ARLAS-web-components). The emitted output has information about
   * the `origin` which is the contributor id of the component; `event` the name of the event; and eventually `data` which contains
   * the emitted data from the component.
   */
  @Output() public outEvents: Subject<{ origin: string, event: string, data?: any }>
    = new Subject<{ origin: string, event: string, data?: any }>();

  @ViewChild('histogram', { static: false }) public histogramComponent: HistogramComponent;
  @ViewChild('detailedhistogram', { static: false }) public detailedHistogramComponent: HistogramComponent;

  constructor(
    private arlasCollaborativesearchService: ArlasCollaborativesearchService,
    private arlasConfigurationService: ArlasConfigService,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService, public arlasExportCsvService: ArlasExportCsvService) {
  }

  public initDetailedContributor() {
    if (!!this.contributor) {
      this.detailedContributor = new DetailedHistogramContributor(this.contributor.identifier + '-arlas__detailed',
        this.arlasCollaborativesearchService, this.arlasConfigurationService, false);
      this.detailedContributor.annexedContributorId = this.contributor.identifier;
      this.detailedContributor.useUtc = this.contributor.useUtc;
      this.detailedContributor.selectionExtentPercentage = 0.02;
      const detailedNbBuckets = !!this.contributor.getNbBuckets() ? this.contributor.getNbBuckets() : 50;
      this.detailedContributor.setNbBuckets(detailedNbBuckets);
      this.detailedContributor.setName(this.contributor.getName() + '__detailed');
      this.detailedContributor.init(this.contributor.getAggregations(), this.contributor.getField(), this.contributor.getJsonPath());
    }
  }

  public ngOnInit() {
    this.initDetailedContributor();
    this.showDetailedHistogramOnCollaborationEnd();
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
      this.showDetailedHistogram = (detailedHistogramRange <= 0.2 * histogramRange.value);
      this.resizeMainHistogram();
      if (!this.showDetailedHistogram && !!this.detailedContributor) {
        this.detailedContributor.updateData = false;
      } else if (this.showDetailedHistogram) {
        this.detailedContributor.updateData = true;
      }
    }
    this.contributor.valueChanged(event);
    this.showSpinner = this.showDetailedHistogram;
  }

  /** reposition interval of the main histogram after the detail histogram finishes plotting */
  public afterDetailedDataPlotted(e) {
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

  private resizeMainHistogram() {
    this.histogramComponent.histogram.histogramParams.chartHeight = this.showDetailedHistogram ?
      this.componentInputs.chartHeight * 0.5 : this.componentInputs.chartHeight;
    this.histogramComponent.histogram.histogramParams.yLabels = this.showDetailedHistogram ? 2 : this.componentInputs.yLabels;
    this.histogramComponent.resizeHistogram();
  }

  /** show detailed histogram if selection range is less than 20% of the main histogram range */
  private showDetailedHistogramOnCollaborationEnd(): void {
    this.arlasCollaborativesearchService.collaborationBus.pipe(filter(c => ((!!this.contributor && this.histogramComponent
      && c.id === this.contributor.identifier) || c.all)))
      .subscribe(c => {
        if (c.operation === OperationEnum.remove) {
          this.histogramIsFiltered = false;
          this.showDetailedHistogram = false;
          this.histogramComponent.histogram.histogramParams.chartHeight = this.componentInputs.chartHeight;
          this.histogramComponent.resizeHistogram();
        } else if (c.operation === OperationEnum.add) {
          this.histogramIsFiltered = true;
        }
      });

    this.arlasCollaborativesearchService.ongoingSubscribe.subscribe(nb => {
      if (this.arlasCollaborativesearchService.totalSubscribe === 0 && this.histogramIsFiltered) {
        const histogramRange = this.contributor.range;
        this.showSpinner = false;
        const selection = this.contributor.intervalSelection;
        if (histogramRange && !!selection) {
          const detailedHistogramRange = (+selection.endvalue - +selection.startvalue);
          this.showDetailedHistogram = (detailedHistogramRange <= 0.2 * histogramRange.value);
          this.resizeMainHistogram();
          if (this.showDetailedHistogram) {
            if (!this.detailedContributor) {
              this.initDetailedContributor();
            }
            this.detailedContributor.updateData = true;
            if (this.detailedHistogramComponent) {
              this.detailedHistogramComponent.histogram.histogramParams.chartHeight = this.componentInputs.chartHeight;
              this.detailedHistogramComponent.resizeHistogram();
            }
          } else {
            if (!!this.detailedContributor) {
              this.detailedContributor.updateData = false;
            }
          }
          if (this.applicationFirstLoad && !!this.detailedContributor && this.detailedContributor.currentSelectedInterval) {
            // Sets current selection of detailed histogram
            const select = this.detailedContributor.currentSelectedInterval;
            this.detailedTimelineIntervalSelection = { startvalue: select.startvalue, endvalue: select.endvalue };
            this.applicationFirstLoad = false;
          }
        } else {
          this.showDetailedHistogram = false;
          this.histogramComponent.histogram.histogramParams.chartHeight = this.componentInputs.chartHeight;
          this.histogramComponent.resizeHistogram();
        }
      }
    });
  }


}
