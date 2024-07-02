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

import { Component, OnInit, Input, ViewChild, ChangeDetectorRef, Output, ElementRef, EventEmitter } from '@angular/core';
import { ArlasStartupService, ArlasCollaborativesearchService } from '../../services/startup/startup.service';
import { Contributor, CollaborationEvent, OperationEnum } from 'arlas-web-core';
import { ChartType, HistogramComponent, CellBackgroundStyleEnum, DataType } from 'arlas-web-components';
import { SwimlaneRepresentation, SwimlaneMode, Position } from 'arlas-d3';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { ArlasExportCsvService } from '../../services/export-csv/export-csv.service';
import { SpinnerOptions, ArlasOverlayRef } from '../../tools/utils';
import { ARLASDonutTooltip } from 'arlas-d3';
import { ArlasOverlayService } from '../../services/overlays/overlay.service';
import { ComputeConfig, MetricsTableContributor, TreeContributor } from 'arlas-web-contributors';
import { Expression } from 'arlas-api';

/**
 * A Widget wraps a component from ARLAS-web-components and bind it to its contributor. The component has thus input data to plot.
 * Note: This component is binded to ARLAS-wui configuration
 */
@Component({
  selector: 'arlas-tool-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.css']
})
export class WidgetComponent implements OnInit {

  public chartType = ChartType;
  public contributorType;
  public contributor;
  public swimSelected;
  public swimlanes = [];
  public indeterminatedItems: Set<string> = new Set<string>();
  public highlightItems: Set<string> = new Set<string>();
  public showSwimlaneDropDown: boolean;
  public graphParam: any = {};
  public metricApproximate = false;
  public donutOverlayRef: ArlasOverlayRef;


  @Input() public componentType;

  /**
   * @Input : Angular
   * @description Identifier of the contributor that serves data to the component
   */
  @Input() public contributorId: string;
  /**
   * @Input : Angular
   * @description Inputs of one of the ARLAS-web-components
   */
  @Input() public componentParams: any;

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
   * @description Whether the widget has to display a detailed version of itself. Currently only used for histograms
   */
  @Input() public noDetail: boolean;

  /**
   * @Output : Angular
   * @description Emits an output that comes from the component (ARLAS-web-components). The emitted output has information about
   * the `origin` which is the contributor id of the component; `event` the name of the event; and eventually `data` which contains
   * the emitted data from the component.
   */
  @Output() public outEvents: Subject<{ origin: string; event: string; data?: any; }>
    = new Subject<{ origin: string; event: string; data?: any; }>();

  @ViewChild('histogram', { static: false }) public histogramComponent: HistogramComponent;

  public constructor(private arlasStartupService: ArlasStartupService,
    private cdr: ChangeDetectorRef,
    private arlasCollaborativesearchService: ArlasCollaborativesearchService,
    private arlasOverlayService: ArlasOverlayService,
    public translate: TranslateService, public arlasExportCsvService: ArlasExportCsvService) {
  }

  public showDonutTooltip(tooltip: ARLASDonutTooltip, e: ElementRef) {
    if (!!this.donutOverlayRef) {
      this.donutOverlayRef.close();
    }
    /** get offset */
    let itemPerLine = 1;
    let xOffset = 470;
    if (this.graphParam.diameter === 170) {
      itemPerLine = 2;
      if (this.position % itemPerLine === 1) {
        xOffset = 240;
      }
    } else if (this.graphParam.diameter === 125) {
      itemPerLine = 3;
      if (this.position % itemPerLine === 1) {
        xOffset = 320;
        if (this.position === this.groupLength - 1) {
          xOffset = 245;
        }
      } else if (this.position % itemPerLine === 2) {
        xOffset = 170;
      }
    }
    if (!!tooltip && tooltip.isShown) {
      this.donutOverlayRef = this.arlasOverlayService.openDonutTooltip({ data: tooltip }, e, xOffset, 0, false);
    }
  }

  public ngOnInit() {
    this.contributorType = this.getContirbutorType();
    this.contributor = this.arlasStartupService.contributorRegistry.get(this.contributorId);
    console.log(this.contributor);
    if (this.componentType === 'swimlane') {
      this.swimlanes = this.contributor.getConfigValue('swimlanes');
      if (this.swimlanes) {
        this.showSwimlaneDropDown = this.swimlanes.length > 1;
        this.swimSelected = this.swimlanes[0];
      }
    } else if (this.contributorType === 'compute') {
      this.metricApproximate = (this.contributor.metrics as Array<ComputeConfig>).filter(c => c.metric === 'cardinality').length > 0;
    }

    this.setComponentInput(this.graphParam);
    /** Init filter operator (include/exclude) of powerbars */
    if (this.contributor instanceof TreeContributor) {
      this.setFilterOperator((this.contributor as TreeContributor).getFilterOperator());
      this.contributor.operatorChangedEvent.subscribe(op => {
        this.setFilterOperator(op);
      });
    }
    if (this.contributor instanceof MetricsTableContributor) {
      this.setFilterOperator((this.contributor as MetricsTableContributor).getFilterOperator());
      this.contributor.operatorChanged$.subscribe(op => {
        this.setFilterOperator(op);
      });
    }
  }

  /**
   * @description Changes swimlane from the pool of swimlanes defined in SwimlaneContributor configuration.
   * @param swimlaneName The name of swimlane.
   */
  public changeSwimlane(swimlaneName) {
    const swimConf = this.swimlanes.filter(f => f.name === swimlaneName.value)[0];
    this.contributor.aggregations = swimConf.aggregationmodels;
    this.contributor.xAxisField = swimConf.xAxisField;
    this.contributor.termField = swimConf.termField;
    if (swimConf.jsonpath) {
      this.contributor.json_path = swimConf.jsonpath;
    }
    const collaborationEvent: CollaborationEvent = {
      id: 'changeSwimlane',
      operation: OperationEnum.add,
      all: true
    };
    this.arlasCollaborativesearchService.collaborationBus.next(collaborationEvent);
  }

  /**
   * Emits the components output events.
   * @param source Contributor identifier
   * @param event Name of the event
   * @param data Emitted data
   */
  public emitEvent(source: string, event: string, data: any) {
    this.outEvents.next({ origin: source, event: event, data: data });
  }

  public exportCsv(contributor: Contributor, stayAtFirstLevel: boolean, componentType: string, contributorType?: string) {
    this.arlasExportCsvService.export(contributor, stayAtFirstLevel, contributorType).subscribe(blob => {
      const contentType = 'text/csv';
      const a = document.createElement('a');
      a.download = contributor.getName().concat('_')
        .concat(componentType)
        .concat('_')
        .concat(new Date().getTime().toString())
        .concat('.csv');
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = [contentType, a.download, a.href].join(':');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }


  public changePowerbarsOperator(op: 'Neq' | 'Eq'): void {
    if (op === 'Neq') {
      (this.contributor as TreeContributor).setFilterOperator(Expression.OpEnum.Ne, /** emit */ true);
    } else {
      (this.contributor as TreeContributor).setFilterOperator(Expression.OpEnum.Eq, /** emit */ true);
    }
    (this.contributor as TreeContributor).selectedNodesListChanged((this.contributor as TreeContributor).selectedNodesPathsList);
  }

  public changeMetricsTableOperator(op: 'Neq' | 'Eq'): void {
    if (op === 'Neq') {
      (this.contributor as MetricsTableContributor).setFilterOperator(Expression.OpEnum.Ne, /** emit */ true);
    } else {
      (this.contributor as MetricsTableContributor).setFilterOperator(Expression.OpEnum.Eq, /** emit */ true);
    }
    (this.contributor as MetricsTableContributor)
      .onRowSelect(new Set((this.contributor as MetricsTableContributor).selectedTerms));
  }


  private getContirbutorType() {
    const contributor = this.arlasStartupService.contributorRegistry.get(this.contributorId);
    if (contributor) {
      const contributorPkgName: string = contributor.getPackageName();
      const componenType: string = contributorPkgName.split('.')[contributorPkgName.split('.').length - 1];
      return componenType;
    }
  }

  private setComponentInput(component: any) {
    if (this.componentParams) {
      Object.keys(this.componentParams).forEach(key => {
        if (key === 'cellBackgroundStyle') {
          component[key] = CellBackgroundStyleEnum[this.componentParams[key]];
        } else if (key === 'chartType') {
          component[key] = ChartType[this.componentParams[key]];
        } else if (key === 'dataType') {
          component[key] = DataType[this.componentParams[key]];
        } else if (key === 'xAxisPosition') {
          component[key] = Position[this.componentParams[key]];
        } else if (key === 'descriptionPosition') {
          component[key] = Position[this.componentParams[key]];
        } else if (key === 'swimlaneMode') {
          component[key] = SwimlaneMode[this.componentParams[key]];
        } else if (key === 'swimlane_representation') {
          component[key] = SwimlaneRepresentation[this.componentParams[key]];
        } else if (key === 'chartTitle' || key === 'valuesDateFormat') {
          if (this.componentParams[key] !== '') {
            component[key] = this.translate.instant(this.componentParams[key]);
          } else {
            component[key] = this.componentParams[key];
          }
        } else {
          component[key] = this.componentParams[key];
        }
      });
    }
  }

  private setFilterOperator(filterOperatorEnum: Expression.OpEnum) {
    if (filterOperatorEnum === Expression.OpEnum.Ne) {
      if (!!this.graphParam.filterOperator) {
        this.graphParam.filterOperator.value = 'Neq';
      } else {
        this.graphParam.filterOperator = {
          value: 'Neq',
          display: true
        };
      }
    } else {
      if (!!this.graphParam.filterOperator) {
        this.graphParam.filterOperator.value = 'Eq';
      } else {
        this.graphParam.filterOperator = {
          value: 'Eq',
          display: true
        };
      }
    }
  }
}
