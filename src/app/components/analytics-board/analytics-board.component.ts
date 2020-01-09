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
  Component, Input, Output, OnInit, AfterViewInit,
  OnChanges, SimpleChanges
} from '@angular/core';
import { Subject } from 'rxjs';
import { AnalyticGroupConfiguration } from './analytics.utils';
import { ArlasCollaborativesearchService, ArlasConfigService } from '../../services/startup/startup.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { OperationEnum } from 'arlas-web-core';
import { ThemePalette, MatSpinner, MatTabChangeEvent } from '@angular/material';
import { OverlayRef, Overlay, PositionStrategy } from '@angular/cdk/overlay';
import { TemplatePortal, ComponentPortal } from '@angular/cdk/portal';
/**
 * This component organizes the `Widgets` in a board.
 * A Widget is declared within a "group" in the configuration. A group contains one or more Widgets
 */
@Component({
  selector: 'arlas-analytics-board',
  templateUrl: './analytics-board.component.html',
  styleUrls: ['./analytics-board.component.css']
})
export class AnalyticsBoardComponent implements OnInit, AfterViewInit, OnChanges {

  /**
   * @Input : Angular
   * @description List of groups. Each group contains one or more widgets.
   */
  @Input() public groups: Array<AnalyticGroupConfiguration>;
  /**
   * @description Map of <groupId, displayStatus> that informs which groupIds to display/hide
   */
  @Input() public groupsDisplayStatusMap: Map<string, boolean>;
  /**
   * @Output : Angular
   * @description Emits an event coming from one of the Widgets.
   * The emitted output has information about
   * the `origin` which is the contributor id of the Widget; `event` the name of the event; and eventually `data` which contains
   * the emitted data from the component.
   */
  @Input() public mode = 'normal';
  @Input() public target: string;
  @Input() public showSpinner = false;
  @Input() public colorSpinner = 'primary';
  @Input() public diameterSpinner = 100;
  @Input() public strokeWidthSpinner = 5;

  @Output() public boardOutputs: Subject<{ origin: string, event: string, data?: any }>
    = new Subject<{ origin: string, event: string, data?: any }>();

  @Output() public modeChange: Subject<string> = new Subject<string>();

  private compGroup: Map<string, string> = new Map<string, string>();
  public activeFilter: Map<string, boolean> = new Map<string, boolean>();

  public isActiveDragDrop = false;

  public wasClosedMap: Map<string, boolean> = new Map<string, boolean>();

  public groupsByTab: Map<string, Array<AnalyticGroupConfiguration>> = new Map<string, Array<AnalyticGroupConfiguration>>();
  public groupsTabsKey: Array<string> = new Array<string>();

  private defaultGroupTabName = 'analytics';

  constructor(private collaborativeService: ArlasCollaborativesearchService, private configService: ArlasConfigService) { }

  public ngOnInit() {
    this.isActiveDragDrop = false;
    const webConfig = this.configService.getValue('arlas.web');
    if (webConfig !== undefined && webConfig.options !== undefined && webConfig.options.drag_items) {
      this.isActiveDragDrop = webConfig.options.drag_items;
    }

    if (!this.groupsDisplayStatusMap && this.groups) {
      this.groupsDisplayStatusMap = new Map<string, boolean>();
      this.groups.forEach(group => this.groupsDisplayStatusMap.set(group.groupId, true));
    }

    if (this.groups) {
      this.groups.forEach(group => {
        if (group.tab && !this.groupsByTab.has(group.tab)) {
          this.groupsByTab.set(group.tab, []);
          this.groupsTabsKey.push(group.tab);
        }
      });
      this.groups.forEach(group => {

        if (group.tab) {
          this.groupsByTab.get(group.tab).push(group);
        } else {
          if (!this.groupsByTab.has(this.defaultGroupTabName)) {
            this.groupsByTab.set(this.defaultGroupTabName, []);
            this.groupsTabsKey.push(this.defaultGroupTabName);
          }
          this.groupsByTab.get(this.defaultGroupTabName).push(group);
        }
        group.components.forEach(comp => {
          this.compGroup.set(comp.contributorId, group.groupId);
        });
      });
    }

    // sort groups given saved order
    const arlasTabsGroupsOrder = localStorage.getItem('arlas_tabs_groups_order');
    if (this.isActiveDragDrop && arlasTabsGroupsOrder) {
      const orderedGroupIdsByTab = new Map(JSON.parse(arlasTabsGroupsOrder));
      orderedGroupIdsByTab.forEach((ids: Array<string>, tabId: string) => {
        if (this.groupsByTab.get(tabId)) {
          this.groupsByTab.get(tabId).sort((a, b) => ids.indexOf(a.groupId) - ids.indexOf(b.groupId));
        }
      });
    }



    if (this.mode === 'compact') {
      this.setActiveFilter();
      this.collaborativeService.collaborationBus.subscribe(() => {
        this.setActiveFilter();
      });
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.target && changes.groups === undefined) {
      this.scrollToAnalyticsComponent(changes.target.currentValue);
    }
  }


  public ngAfterViewInit() {
    this.scrollToAnalyticsComponent(this.target);
    // hide tabs group if only one
    if (this.groupsByTab.size === 1) {
      document.querySelector('.only-one > :first-child').remove();
    } else {
      document.querySelector('.analytics-tabs .mat-tab-header')
        .setAttribute('style', 'background-color: white !important;border-radius: 4px !important;margin: 0 2px !important;');
    }

    this.cancelAllOtherTabsContribution(0);
  }

  public scrollToAnalyticsComponent(target: string) {
    if (this.mode === 'normal' && target !== undefined) {
      const element = (<HTMLElement>document.getElementById(target));
      element.scrollIntoView(true);
    }
  }

  public setActiveFilter() {
    this.activeFilter.clear();
    this.collaborativeService.getEnableContributors().forEach(contrib => {
      this.activeFilter.set(this.compGroup.get(contrib), true);
    });
  }

  /**
   * Emits the widgets output events.
   * @param source Contributor identifier
   * @param event Name of the event
   * @param data Emitted data
   */
  public listenOutput(event: { origin: string, event: string, data?: any }) {
    this.boardOutputs.next(event);
  }

  public drop(event: CdkDragDrop<string[]>, tabKey: string) {
    moveItemInArray(this.groupsByTab.get(tabKey), event.previousIndex, event.currentIndex);
    const groupIdsByTab = new Map<string, Array<String>>();
    this.groupsByTab.forEach((tab, tabId) => {
      groupIdsByTab.set(tabId, tab.map(group => group.groupId));
    });
    localStorage.setItem('arlas_tabs_groups_order', JSON.stringify([...groupIdsByTab]));
  }

  public changeMode(event) {
    this.modeChange.next(event);
  }

  public removeFilter(groupId: string, event: any) {
    Array.from(this.compGroup.entries()).filter(group => group[1] === groupId).forEach(mapGroup => {
      Array.from(this.collaborativeService.collaborations.keys()).filter(cont => cont === mapGroup[0]).forEach(contributor => {
        this.collaborativeService.removeFilter(contributor);
      });
    });
    event.stopPropagation();
  }

  /**
   *
   * @param group Group declared in configuration file
   * @param display Whether to display the widget
   */
  public addWidget(group: AnalyticGroupConfiguration, display: boolean): void {
    if (group && group.groupId) {
      this.groupsDisplayStatusMap.set(group.groupId, display);
      this.groups.push(group);
    }
  }

  public openPanel(group: AnalyticGroupConfiguration) {
    this.activateGroupContribution(group);
  }
  public closePanel(group: AnalyticGroupConfiguration) {
    this.cancelGroupContribution(group);
  }

  public getContributorStatus(id) {
    return this.collaborativeService.registry.get(id).isDataUpdating;
  }

  public tabChange(index: number) {
    this.cancelAllOtherTabsContribution(index);

    Array.from(this.groupsByTab.entries())
      .filter(groupByTab => groupByTab[0] === this.groupsTabsKey[index])
      .map(groupByTab => groupByTab[1])
      .forEach(groups => {
        groups.forEach(group => {
          this.activateGroupContribution(group);
        });
      });
  }

  public cancelAllOtherTabsContribution(tabIndex: number) {
    Array.from(this.groupsByTab.entries())
      .filter(groupByTab => groupByTab[0] !== this.groupsTabsKey[tabIndex])
      .map(groupByTab => groupByTab[1])
      .forEach(groups => {
        groups.forEach(group => {
          this.cancelGroupContribution(group);
        });
      });
  }

  public cancelGroupContribution(group: AnalyticGroupConfiguration) {
    this.wasClosedMap.set(group.groupId, true);
    group.components
      .map(componentConfig => componentConfig.contributorId)
      .map(contribId => this.collaborativeService.registry.get(contribId))
      .map(contributor => contributor.updateData = false);
  }

  public activateGroupContribution(group: AnalyticGroupConfiguration) {
    const nbComponents = group.components.length;
    let nbComponentsActivated = 0;
    group.components
      .map(componentConfig => componentConfig.contributorId)
      .map(contribId => this.collaborativeService.registry.get(contribId))
      .map(contributor => {
        contributor.updateData = true;
        if (this.wasClosedMap.get(group.groupId)) {
          contributor.updateFromCollaboration({
            id: '',
            operation: OperationEnum.add,
            all: false
          });
          nbComponentsActivated++;
          if (nbComponentsActivated === nbComponents) {
            this.wasClosedMap.set(group.groupId, false);
          }
        }
      });
  }
}
