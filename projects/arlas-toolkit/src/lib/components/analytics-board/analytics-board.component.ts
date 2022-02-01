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
  OnChanges, SimpleChanges, ElementRef
} from '@angular/core';
import { Subject } from 'rxjs';
import { AnalyticGroupConfiguration } from './analytics.utils';
import { ArlasCollaborativesearchService, ArlasConfigService } from '../../services/startup/startup.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { OperationEnum } from 'arlas-web-core';
import { SpinnerOptions } from '../../tools/utils';
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

  @Input() public mode = 'normal';
  @Input() public target: string;

  /**
   * @Input : Angular
   * @description Whether or not the spinner is displayed when a component is loading data
   */
  @Input() public showSpinner = false;

  @Input() public colorSpinner = 'primary';
  @Input() public diameterSpinner = 100;
  @Input() public strokeWidthSpinner = 5;

  /**
   * @Input : Angular
   * @description Whether or not the indicators are displayed when a filter is active on a group or tab
   */
  @Input() public showIndicators = false;


  /**
   * @Output : Angular
   * @description Emits an event coming from one of the Widgets.
   * The emitted output has information about
   * the `origin` which is the contributor id of the Widget; `event` the name of the event; and eventually `data` which contains
   * the emitted data from the component.
   */
  @Output() public boardOutputs: Subject<{ origin: string; event: string; data?: any; }>
    = new Subject<{ origin: string; event: string; data?: any; }>();

  @Output() public modeChange: Subject<string> = new Subject<string>();

  public spinnerOptions: SpinnerOptions;
  private compGroup: Map<string, string> = new Map<string, string>();
  public activeFilterGroup: Map<string, boolean> = new Map<string, boolean>();
  private groupTab: Map<string, string> = new Map<string, string>();
  public activeFilterTab: Map<string, boolean> = new Map<string, boolean>();

  public isActiveDragDrop = false;

  public wasClosedMap: Map<string, boolean> = new Map<string, boolean>();

  public groupsByTab: Array<{ index: string; groups: Array<AnalyticGroupConfiguration>; }>
    = new Array<{ index: string; groups: Array<AnalyticGroupConfiguration>; }>();
  public groupsTabsKey: Array<string> = new Array<string>();

  private defaultGroupTabName = 'analytics';
  private activeIndex;

  public constructor(private collaborativeService: ArlasCollaborativesearchService, private configService: ArlasConfigService) {

  }

  public ngOnInit() {
    this.isActiveDragDrop = false;
    this.spinnerOptions = {
      color: !!this.colorSpinner ? this.colorSpinner : 'primary',
      diameter: (this.diameterSpinner !== undefined && this.diameterSpinner !== null) ? this.diameterSpinner : 100,
      strokeWidth: (this.strokeWidthSpinner !== undefined && this.strokeWidthSpinner !== null) ? this.strokeWidthSpinner : 5,
    };
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
        if (group.tab && this.groupsByTab.filter(item => item.index === group.tab).length === 0) {
          this.groupsByTab.push({ index: group.tab, groups: new Array<AnalyticGroupConfiguration>() });
          this.groupsTabsKey.push(group.tab);
        }
      });
      this.groups.forEach(group => {

        if (group.tab) {
          this.groupsByTab.filter(tabGroup => tabGroup.index === group.tab).map(tabGroup => tabGroup.groups.push(group));
          this.groupTab.set(group.groupId, group.tab);
        } else {
          if (this.groupsByTab.filter(item => item.index === this.defaultGroupTabName).length === 0) {
            this.groupsByTab.push({ index: this.defaultGroupTabName, groups: new Array<AnalyticGroupConfiguration>() });
            this.groupsTabsKey.push(this.defaultGroupTabName);
          }
          this.groupTab.set(group.groupId, this.defaultGroupTabName);
          this.groupsByTab.filter(tabGroup => tabGroup.index === this.defaultGroupTabName).map(tabGroup => tabGroup.groups.push(group));
        }
        group.components.forEach(comp => {
          this.compGroup.set(comp.contributorId, group.groupId);
        });

        if (group.collapsed) {
          this.wasClosedMap.set(group.groupId, group.collapsed);
        }
      });
    }

    // sort groups given saved order
    const arlasTabsGroupsOrder = localStorage.getItem('arlas_tabs_groups_order');
    if (this.isActiveDragDrop && arlasTabsGroupsOrder) {
      const orderedGroupIdsByTab = new Map(JSON.parse(arlasTabsGroupsOrder));
      orderedGroupIdsByTab.forEach((ids: Array<string>, tabId: string) => {
        const currentTab = this.groupsByTab.filter(groupTab => groupTab.index === tabId);
        if (currentTab.length > 0) {
          currentTab[0].groups.sort((a, b) => ids.indexOf(a.groupId) - ids.indexOf(b.groupId));
        }
      });
    }


    // Set groups and tabs badge
    this.setActiveFilterGroup();
    this.setActiveFilterTab();
    this.collaborativeService.collaborationBus.subscribe(() => {
      this.setActiveFilterTab();
      this.setActiveFilterGroup();
    });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.target && changes.groups === undefined) {
      this.scrollToAnalyticsComponent(changes.target.currentValue);
    }
  }


  public ngAfterViewInit() {
    this.scrollToAnalyticsComponent(this.target);
    // hide tabs group if only one
    if (this.groupsByTab.length === 1) {
      const firstTabs = document.querySelectorAll('.only-one > :first-child');
      firstTabs.forEach(tab => {
        if (!!tab && tab.outerHTML.startsWith('<mat-tab-header')) {
          tab.remove();
        }
      });
    } else {
      const tabHeader: Element = document.querySelector('.analytics-tabs .mat-tab-header');
      if (tabHeader && tabHeader !== undefined) {
        tabHeader.setAttribute('style', 'background-color: white !important;border-radius: 4px !important;margin: 0 2px !important;');
      }
    }

    this.cancelAllOtherTabsContribution(0);
  }

  public scrollToAnalyticsComponent(target: string) {
    if (this.mode === 'normal' && target !== undefined) {
      const element = (<HTMLElement>document.getElementById(target));
      element.scrollIntoView(true);
    }
  }

  public setActiveFilterGroup() {
    this.activeFilterGroup.clear();
    this.collaborativeService.getEnableContributors().forEach(contrib => {
      this.activeFilterGroup.set(this.compGroup.get(contrib), true);
    });
  }

  public setActiveFilterTab() {
    this.activeFilterTab.clear();
    this.collaborativeService.getEnableContributors().forEach(contrib => {
      this.activeFilterTab.set(this.groupTab.get(this.compGroup.get(contrib)), true);
    });
  }

  /**
   * Emits the widgets output events.
   * @param source Contributor identifier
   * @param event Name of the event
   * @param data Emitted data
   */
  public listenOutput(event: { origin: string; event: string; data?: any; }) {
    this.boardOutputs.next(event);
  }

  public drop(event: CdkDragDrop<string[]>, tabKey: string) {
    const currentTabGroups = this.groupsByTab.filter(groupTab => groupTab.index === tabKey).map(groupTab => groupTab.groups);
    moveItemInArray(currentTabGroups[0], event.previousIndex, event.currentIndex);
    const groupIdsByTab = new Map<string, Array<String>>();
    this.groupsByTab.forEach((tab) => {
      groupIdsByTab.set(tab.index, tab.groups.map(group => group.groupId));
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

  public removeTabFilter(tabId: string, event: any) {
    Array.from(this.groupTab.entries()).filter(tab => tab[1] === tabId).forEach(mapTab => {
      this.removeFilter(mapTab[0], event);
    });
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
    this.groupsByTab.forEach(groupTab => {
      groupTab.groups.map(grp => {
        if (grp.groupId === group.groupId) {
          grp.collapsed = false;
        }
      });
    });
    this.activateGroupContribution(group);
  }
  public closePanel(group: AnalyticGroupConfiguration) {
    this.groupsByTab.forEach(groupTab => {
      groupTab.groups.map(grp => {
        if (grp.groupId === group.groupId) {
          grp.collapsed = true;
        }
      });
    });
    this.cancelGroupContribution(group);
  }

  public getContributorStatus(id) {
    return this.collaborativeService.registry.get(id).isDataUpdating;
  }

  public tabChange(index: number) {
    this.activeIndex = index;
  }

  public cancelAllOtherTabsContribution(tabIndex: number) {

    this.groupsByTab.filter(groupTab => groupTab.index !== this.groupsTabsKey[tabIndex])
      .map(groupTab => groupTab.groups)
      .forEach(groups => {
        groups.forEach(group => {
          this.cancelGroupContribution(group);
        });
      });
  }

  public animationDone() {
    if (this.activeIndex !== undefined) {

      this.cancelAllOtherTabsContribution(this.activeIndex);

      this.groupsByTab.filter(groupTab => groupTab.index === this.groupsTabsKey[this.activeIndex])
        .map(groupTab => groupTab.groups)
        .forEach(groups => {
          groups.forEach(group => {
            if (!group.collapsed) {
              this.activateGroupContribution(group);
            }
          });
        });
    }
  }

  public cancelGroupContribution(group: AnalyticGroupConfiguration) {
    this.wasClosedMap.set(group.groupId, true);
    // Get all contributors ID from the current active tab
    const currentIndex = !!this.activeIndex ? this.activeIndex : 0;
    const currentTabContributorsId = [];
    this.groupsByTab[currentIndex].groups.forEach(group => {
      group.components.forEach(c => currentTabContributorsId.push(c.contributorId));
    });
    group.components
      // Disable only contributors not present in the current tab
      .filter(c => !currentTabContributorsId.includes(c.contributorId))
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
