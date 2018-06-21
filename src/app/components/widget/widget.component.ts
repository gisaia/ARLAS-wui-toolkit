import { HistogramContributor } from 'arlas-web-contributors';
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

import { Component, OnInit, Input, AfterViewInit, ViewChild, ChangeDetectorRef, ComponentFactoryResolver, Output } from '@angular/core';
import { ArlasStartupService, ArlasConfigService, ArlasCollaborativesearchService } from '../../services/startup/startup.service';
import { Contributor, CollaborationEvent, OperationEnum } from 'arlas-web-core';
import { contributors } from 'arlas-web-contributors';
import { ChartType, HistogramComponent, Position, SwimlaneMode, DonutComponent } from 'arlas-web-components';
import { PowerbarsComponent } from 'arlas-web-components/powerbars/powerbars.component';
import { DataType, SelectedOutputValues } from 'arlas-web-contributors/models/models';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'arlas-tool-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.css']
})
export class WidgetComponent implements OnInit {


  public chartType = ChartType;

  public componentType;
  public contributor;
  public swimSelected;
  public swimlanes = [];
  public indeterminatedItems: Set<string> = new Set<string>();
  public highlightItems: Set<string> = new Set<string>();
  public showSwimlaneDropDown: boolean;
  public graphParam: any = {};

  @Input() public contributorId: string;
  @Input() public componentParams: any;
  @Output() public outEvents: Subject<{ origin: string, event: string, data?: any }>
    = new Subject<{ origin: string, event: string, data?: any }>();

  @ViewChild('histogram') public histogramComponent: HistogramComponent;

  constructor(private arlasStartupService: ArlasStartupService,
    private cdr: ChangeDetectorRef, private componentFactoryResolver: ComponentFactoryResolver,
    private arlasCollaborativesearchService: ArlasCollaborativesearchService,
    public translate: TranslateService) {
  }

  public ngOnInit() {
    this.componentType = this.getComponentType();
    this.contributor = this.arlasStartupService.contributorRegistry.get(this.contributorId);
    if (this.componentType === 'swimlane') {
      this.swimlanes = this.contributor.getConfigValue('swimlanes');
      this.showSwimlaneDropDown = this.swimlanes.length > 1;
      this.swimSelected = this.swimlanes[0];
    }
    this.setComponentInput(this.graphParam);
  }

  public changeSwimlane(event) {
    const swimConf = this.swimlanes.filter(f => f.name === event.value)[0];
    this.contributor.aggregations = swimConf.aggregationmodels;
    this.contributor.field = swimConf.field;
    const collaborationEvent: CollaborationEvent = {
      id: 'changeSwimlane',
      operation: OperationEnum.add,
      all: true
    };
    this.arlasCollaborativesearchService.collaborationBus.next(collaborationEvent);
  }

  private getComponentType() {
    const contributor: Contributor = this.arlasStartupService.contributorRegistry.get(this.contributorId);
    if (contributor) {
      const contributorPkgName: string = contributor.getPackageName();
      const componenType: string = contributorPkgName.split('.')[contributorPkgName.split('.').length - 1];
      return componenType;
    }
  }

  private setComponentInput(component: any) {
    if (this.componentParams) {
      Object.keys(this.componentParams).forEach(key => {
        if (key === 'chartType') {
          component[key] = ChartType[this.componentParams[key]];
        } else if (key === 'dataType') {
          component[key] = DataType[this.componentParams[key]];
        } else if (key === 'xAxisPosition') {
          component[key] = Position[this.componentParams[key]];
        } else if (key === 'descriptionPosition') {
          component[key] = Position[this.componentParams[key]];
        } else if (key === 'swimlaneMode') {
          component[key] = SwimlaneMode[this.componentParams[key]];
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

  private emitEvent(source: string, event: string, data: any) {
    this.outEvents.next({ origin: source, event: event, data: data });
  }
}

