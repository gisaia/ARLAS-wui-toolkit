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

import { Component, OnInit, Input, ViewChild, ChangeDetectorRef, ComponentFactoryResolver, Output } from '@angular/core';
import { ArlasStartupService, ArlasCollaborativesearchService } from '../../services/startup/startup.service';
import { Contributor, CollaborationEvent, OperationEnum } from 'arlas-web-core';
import { ChartType, HistogramComponent, CellBackgroundStyleEnum, DataType } from 'arlas-web-components';
import { SwimlaneRepresentation, SwimlaneMode, Position } from 'arlas-d3';
import { TranslateService } from '@ngx-translate/core';
import { Subject, from } from 'rxjs';
import { ArlasExportCsvService } from '../../services/export-csv/export-csv.service';

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
   * @Output : Angular
   * @description Emits an output that comes from the component (ARLAS-web-components). The emitted output has information about
   * the `origin` which is the contributor id of the component; `event` the name of the event; and eventually `data` which contains
   * the emitted data from the component.
   */
  @Output() public outEvents: Subject<{ origin: string, event: string, data?: any }>
    = new Subject<{ origin: string, event: string, data?: any }>();

  @ViewChild('histogram', { static: false }) public histogramComponent: HistogramComponent;

  constructor(private arlasStartupService: ArlasStartupService,
    private cdr: ChangeDetectorRef, private componentFactoryResolver: ComponentFactoryResolver,
    private arlasCollaborativesearchService: ArlasCollaborativesearchService,
    public translate: TranslateService, public arlasExportCsvService: ArlasExportCsvService) {
  }

  public ngOnInit() {
    this.contributorType = this.getContirbutorType();
    this.contributor = this.arlasStartupService.contributorRegistry.get(this.contributorId);
    if (this.componentType === 'swimlane') {
      this.swimlanes = this.contributor.getConfigValue('swimlanes');
      if (this.swimlanes) {
        this.showSwimlaneDropDown = this.swimlanes.length > 1;
        this.swimSelected = this.swimlanes[0];
      }
    }
    this.setComponentInput(this.graphParam);
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

  public exportCsv(contributor: Contributor, stayAtFirstLevel: boolean, componentType: string) {
    this.arlasExportCsvService.export(contributor, stayAtFirstLevel).subscribe(blob => {
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
}
