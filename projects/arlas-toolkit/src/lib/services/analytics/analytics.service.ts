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

import { EventEmitter, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArlasCollaborativesearchService, ArlasConfigService, ArlasStartupService } from '../startup/startup.service';
import { AnalyticGroupConfiguration, AnalyticsTabs } from '../../components/analytics/analytics.utils';
import { Contributor, OperationEnum } from 'arlas-web-core';
import { HistogramContributor } from 'arlas-web-contributors';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { hasContributorData } from '../../tools/utils';


@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  /**
   * @description Emits the name of the tab when the selected tab in the menu has changed
   */
  public tabChange: EventEmitter<string> = new EventEmitter();

  /**
   * @description Whether drag and drop is active for the groups inside of the analytics board
   */
  public isActiveDragDrop: boolean;

  /**
   * @description List of groups. Each group contains one or more widgets.
   */
  private _groups: Array<AnalyticGroupConfiguration>;

  /**
   * @description List of tabs. Each tab contains one or more groups.
   */
  private _tabs: Array<AnalyticsTabs>;

  /**
   * @description Map of which group(s) each contributor belong to
   */
  private _contributorGroup: Map<string, Array<string>> = new Map();

  /**
   * @description Map of which tab each group belong to
   */
  private _groupTab: Map<string, string> = new Map();

  /**
   * @description List of groups with their tab's name
   */
  private _groupsByTab: Array<{ name: string; groups: Array<AnalyticGroupConfiguration>; }> = new Array();

  /**
   * @description Map of the open/close state of groups
   */
  private _wasClosedMap: Map<string, boolean> = new Map();

  /**
   * @description Map of whether to display each group
   */
  private _groupsDisplayStatusMap: Map<string, boolean>;

  /**
   * @description Index of the currently selected tab. Can be undefined when no tab is selected.
   */
  private _activeTab: number | undefined;

  /**
   * @description Map of which groups are currently filtered on
   */
  private _activeFilterGroup: Map<string, boolean> = new Map();

  /**
   * @description Map of which tabs are currently filtered on
   */
  private _activeFilterTab: Map<string, boolean> = new Map();

  /**
   * @description Name of the tab in which groups are put by default if they don't belong in one.
   */
  private defaultGroupTabName = 'analytics';

  public constructor(
    private configService: ArlasConfigService,
    private collaborativeService: ArlasCollaborativesearchService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
  }

  public setGroupsDisplayStatusMap(statusMap: Map<string, boolean>) {
    this._groupsDisplayStatusMap = statusMap;
  }

  public getActiveGroups() {
    return this._activeTab !== undefined ? this._groupsByTab[this._activeTab].groups : [];
  }

  /**
   * Triggered when a tab is selected by the menu.
   * Updates the URL to store which tab the user is currently on.
   * Deactivates data updating of the widgets of the hidden tabs.
   * Emits a tab change event.
   * @param tabIndex Index of the tab selected. Can be undefined if none is selected.
   */
  public selectTab(tabIndex: number | undefined) {
    if (tabIndex >= this._tabs.length) {
      throw new Error(`The index of the analytics tab selected does not exist. There are onlys ${this._tabs.length} tabs.`);
    }

    this._activeTab = tabIndex;
    const tabName = tabIndex !== undefined ? this._tabs[tabIndex].name : undefined;
    // Indicate to analytics board that the tab was changed
    this.tabChange.next(tabName);

    // Navigate to new url
    const queryParams = Object.assign({}, this.activatedRoute.snapshot.queryParams);
    if (tabName === undefined) {
      delete queryParams['at'];
    } else {
      queryParams['at'] = tabName;
    }
    this.router.navigate([], { replaceUrl: true, queryParams: queryParams });

    // Remove collaborations of other tabs
    // Remove all contributions but the one of the active tab
    if (this._activeTab !== undefined) {
      this.cancelAllOtherTabsContribution(this._activeTab);
      this.getActiveGroups().forEach(g => {
        if (g.collapsed !== true) {
          this.activateGroupContribution(g);
        }
      });
    } else {
      // If no active tab, then remove every tab contributions
      this.cancelAllTabsContribution();
    }
  }

  /**
   * Activates the data upating of the contributors of every widget of the group.
   * @param group Configuration of the group to display
   */
  public openPanel(group: AnalyticGroupConfiguration) {
    this._groupsByTab.forEach(groupTab => {
      groupTab.groups.map(grp => {
        if (grp.groupId === group.groupId) {
          grp.collapsed = false;
        }
      });
    });
    if (group.tab === this._tabs[this._activeTab].name) {
      this.activateGroupContribution(group);
    }
  }

  /**
   * Deactivates the data upating of the contributors of every widget of the group.
   * @param group Configuration of the group to hide
   */
  public closePanel(group: AnalyticGroupConfiguration) {
    this._groupsByTab.forEach(groupTab => {
      groupTab.groups.map(grp => {
        if (grp.groupId === group.groupId) {
          grp.collapsed = true;
        }
      });
    });
    this.cancelGroupContribution(group);
  }

  public cancelAllOtherTabsContribution(tabIndex: number) {
    this._groupsByTab.filter(groupTab => groupTab.name !== this._tabs[tabIndex].name)
      .map(groupTab => groupTab.groups)
      .forEach(groups => {
        groups.forEach(group => {
          this.cancelGroupContribution(group);
        });
      });
  }

  public cancelAllTabsContribution() {
    this._groupsByTab
      .map(groupTab => groupTab.groups)
      .forEach(groups => {
        groups.forEach(group => {
          this.cancelGroupContribution(group);
        });
      });
  }

  /**
   * Deactivates all the contributors of the group that are not present in the active tab.
   * @param group Configuration of the group to deactivate
   */
  public cancelGroupContribution(group: AnalyticGroupConfiguration) {
    this._wasClosedMap.set(group.groupId, true);
    // Get all contributors ID from the current active tab that are not collapsed
    const currentIndex = !!this._activeTab ? this._activeTab : 0;
    const currentTabContributorsId = [];
    this._groupsByTab[currentIndex].groups.forEach(group => {
      if (group.collapsed !== true) {
        group.components.forEach(c => currentTabContributorsId.push(c.contributorId));
      }
    });

    group.components
      // Disable only contributors not present in the current tab not collapsed
      .filter(c => !currentTabContributorsId.includes(c.contributorId))
      .map(componentConfig => componentConfig.contributorId)
      .map(contribId => this.collaborativeService.registry.get(contribId))
      .forEach(contributor => {
        contributor.updateData = false;
      });
  }

  /**
   * Activates all the contributors of the group.
   * @param group Configuration of the group to activate
   */
  public activateGroupContribution(group: AnalyticGroupConfiguration) {
    group.components
      .map(componentConfig => componentConfig.contributorId)
      .map(contribId => this.collaborativeService.registry.get(contribId))
      .forEach(contributor => {
        contributor.updateData = true;
        // if (!this.collaborativeService.endOfUrlCollaboration) {
        //   // At first loading of the application, the current tab groups are already open.
        //   // No need to reload the data, it is already done by the global setCollaboration ('url')
        //   this._wasClosedMap.set(group.groupId, false);
        // }
        // Or if there is no data
        if (this._wasClosedMap.get(group.groupId) || !hasContributorData(contributor)) {
          this.updateFromCollaboration(contributor);
        }
      });
    this._wasClosedMap.set(group.groupId, false);
  }

  /**
   *
   * @param group Group declared in configuration file
   * @param display Whether to display the widget
   */
  public addWidget(group: AnalyticGroupConfiguration, display: boolean): void {
    if (group && group.groupId) {
      this._groupsDisplayStatusMap.set(group.groupId, display);
      this._groups.push(group);
    }
  }

  /**
   * Removes all the filters of the given group
   * @param groupId Group id
   */
  public removeFilter(groupId: string) {
    Array.from(this._contributorGroup.entries()).filter(group => group[1].includes(groupId)).forEach(mapGroup => {
      Array.from(this.collaborativeService.collaborations.keys()).filter(cont => cont === mapGroup[0]).forEach(contributor => {
        this.collaborativeService.removeFilter(contributor);
      });
    });
  }

  /**
   * Removes all the filters of the given tab
   * @param tabId Tab id
   */
  public removeTabFilter(tabId: string) {
    Array.from(this._groupTab.entries()).filter(tab => tab[1] === tabId).forEach(mapTab => {
      this.removeFilter(mapTab[0]);
    });
  }

  /**
   * Updates the map of which groups are currently filtered on
   */
  public setActiveFilterGroup() {
    this._activeFilterGroup.clear();
    this.collaborativeService.getEnableContributors().forEach(contrib => {
      // It is possible that a contributor is not linked to a group (timeline)
      const groups = this._contributorGroup.get(contrib);
      if (!!groups) {
        groups.forEach(groupId => {
          this._activeFilterGroup.set(groupId, true);
        });
      }
    });
  }

  /**
   * Updates the map of which tabs are currently filtered on
   */
  public setActiveFilterTab() {
    this._activeFilterTab.clear();
    this.collaborativeService.getEnableContributors().forEach(contrib => {
      // It is possible that a contributor is not linked to a group (timeline)
      const groups = this._contributorGroup.get(contrib);
      if (!!groups) {
        groups.forEach(groupId => {
          this._activeFilterTab.set(this._groupTab.get(groupId), true);
        });
      }
    });
  }

  /**
   * Updates the order of the groups of the current tab.
   * Stores in the local storage this new order.
   * @param event Drop event of a group being moved
   */
  public dropGroup(event: CdkDragDrop<string[]>) {
    const currentTabGroups = this.getActiveGroups();
    moveItemInArray(currentTabGroups, event.previousIndex, event.currentIndex);
    const groupIdsByTab = new Map<string, Array<String>>();
    this._groupsByTab.forEach((tab) => {
      groupIdsByTab.set(tab.name, tab.groups.map(group => group.groupId));
    });
    localStorage.setItem('arlas_tabs_groups_order', JSON.stringify([...groupIdsByTab]));
  }

  /**
   * Initialize the mapping of the designated tab with its groups if not already done
   * @param tabName The considered tab's name
   */
  private initTabMapping(tabName: string) {
    if (this._groupsByTab.filter(item => item.name === tabName).length === 0) {
      this._groupsByTab.push({ name: tabName, groups: new Array<AnalyticGroupConfiguration>() });
    }
  }

  /**
   * Stores group in the correct tab, and indicates the correct tab for the group
   * @param group The considered group
   * @param tabName The considered tab name
   */
  private fillTabMapping(group: AnalyticGroupConfiguration, tabName: string) {
    this._groupsByTab.filter(tabGroup => tabGroup.name === tabName).forEach(tabGroup => tabGroup.groups.push(group));
    this._groupTab.set(group.groupId, tabName);
  }

  private updateFromCollaboration(contributor: Contributor) {
    contributor.updateFromCollaboration({
      id: contributor.linkedContributorId,
      operation: OperationEnum.add,
      all: false
    });
    if (contributor instanceof HistogramContributor) {
      const histContributor = contributor as HistogramContributor;
      if (histContributor.detailedHistrogramContributor && histContributor.detailedHistrogramContributor.updateData) {
        histContributor.detailedHistrogramContributor.updateFromCollaboration({
          id: contributor.linkedContributorId,
          operation: OperationEnum.add,
          all: false
        });
      }
    }
  }

  /**
   * @description List of groups. Each group contains one or more widgets.
   */
  public get groups() {
    return this._groups;
  }

  public initializeGroups(groups: Array<AnalyticGroupConfiguration>) {
    this.reset();
    this._groups = groups;
    this._groups?.forEach(group => {
      this.initTabMapping(group.tab ? group.tab : this.defaultGroupTabName);
      this.fillTabMapping(group, group.tab ? group.tab : this.defaultGroupTabName);

      // Issue with same contributor in different tabs ?
      group.components.forEach(comp => {
        if (!this._contributorGroup.get(comp.contributorId)) {
          this._contributorGroup.set(comp.contributorId, [group.groupId]);
        } else {
          this._contributorGroup.get(comp.contributorId).push(group.groupId);
        }
      });
      if (group.collapsed) {
        this._wasClosedMap.set(group.groupId, group.collapsed);
      }
    });

    // Get tabs from config
    const webConfig = this.configService.getValue('arlas.web');
    if (webConfig !== undefined && webConfig.options !== undefined) {
      if (webConfig.options.drag_items) {
        this.isActiveDragDrop = webConfig.options.drag_items;
      }

      if (webConfig.options.tabs) {
        this._tabs = webConfig.options.tabs;
        const tabsWithGroups = this._groupsByTab.map(v => v.name);
        this._tabs = this._tabs.filter(tab => tabsWithGroups.includes(tab.name));
      }
    }

    // If there are no tabs in the config, there are either really no tabs,
    // or the config has no tabs declared, but groups that should be in their designated tabs
    /** Retro-compatibility code */
    if (this._tabs.length === 0 && !!this._groups) {
      const tabsSet = new Set<string>();
      this._groups.forEach(group => {
        if (!tabsSet.has(group.tab)) {
          tabsSet.add(group.tab);
          this._tabs.push({
            icon: 'short_text',
            name: group.tab,
            showIcon: false,
            showName: false
          });
        }
      });
    }
    /** End of retro-compatibility code */

    if (!this._groupsDisplayStatusMap) {
      this._groupsDisplayStatusMap = new Map<string, boolean>();
    }

    this._groups?.forEach(group => this._groupsDisplayStatusMap.set(group.groupId, true));

    // sort groups given saved order
    const arlasTabsGroupsOrder = localStorage.getItem('arlas_tabs_groups_order');
    if (this.isActiveDragDrop && arlasTabsGroupsOrder) {
      const orderedGroupIdsByTab = new Map(JSON.parse(arlasTabsGroupsOrder));
      orderedGroupIdsByTab.forEach((ids: Array<string>, tabName: string) => {
        const currentTab = this._groupsByTab.filter(groupTab => groupTab.name === tabName);
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

  /**
   * In case of using the service with several instances of AnalyticsBoardComponent, the global variables should
   * be reset if we re-initialize groups.
   */
  private reset() {
    this._tabs = [];
    this._groupsByTab = [];
    this._groupsDisplayStatusMap = new Map<string, boolean>();
  }

  /**
   * @description List of tabs. Each tab contains one or more groups.
   */
  public get tabs() {
    return this._tabs;
  }

  /**
   * @description Map of whether to display each group
   */
  public get groupsDisplayStatusMap() {
    return this._groupsDisplayStatusMap;
  }

  /**
   * @description Map of which tabs are currently filtered on
   */
  public get activeFilterTab() {
    return this._activeFilterTab;
  }

  /**
   * @description Map of which groups are currently filtered on
   */
  public get activeFilterGroup() {
    return this._activeFilterGroup;
  }

  /**
   * @description Index of the currently selected tab. Can be undefined when no tab is selected.
   */
  public get activeTab() {
    return this._activeTab;
  }
}
