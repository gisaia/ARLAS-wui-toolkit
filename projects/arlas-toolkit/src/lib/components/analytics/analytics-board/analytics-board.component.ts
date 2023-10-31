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
  OnChanges, SimpleChanges, EventEmitter, OnDestroy
} from '@angular/core';
import { AnalyticGroupConfiguration } from '../analytics.utils';
import { ArlasCollaborativesearchService } from '../../../services/startup/startup.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { SpinnerOptions } from '../../../tools/utils';
import { AnalyticsService } from '../../../services/analytics/analytics.service';
import { Subscription } from 'rxjs';

/**
 * This component organizes the `Widgets` in a board.
 * A Widget is declared within a "group" in the configuration. A group contains one or more Widgets
 */
@Component({
  selector: 'arlas-analytics-board',
  templateUrl: './analytics-board.component.html',
  styleUrls: ['./analytics-board.component.scss']
})
export class AnalyticsBoardComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {

  /**
   * @Input : Angular
   * @description Display mode of the analytics tab. Can be 'normal' or 'compact'.
   */
  @Input() public mode = 'normal';

  /**
   * @Input : Angular
   * @description Id of the element to scroll to inside of the analytics board.
   */
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
  @Output() public boardOutputs: EventEmitter<{ origin: string; event: string; data?: any; }> = new EventEmitter();

  /**
   * @Output : Angular
   * @description Emits an event when the display mode of a group is changed. The value transmitted is the group id
   */
  @Output() public modeChange: EventEmitter<string> = new EventEmitter();

  public spinnerOptions: SpinnerOptions;

  /**
   * @description List of groups. Each group contains one or more widgets.
   */
  public groups: Array<AnalyticGroupConfiguration>;

  public expandedHeaderHeight = 48;
  public collapsedHeaderHeight = 32;
  private tabChangeSubscription: Subscription;
  public constructor(
    private collaborativeService: ArlasCollaborativesearchService,
    public analyticsService: AnalyticsService,
  ) { }

  public ngOnInit() {
    this.spinnerOptions = {
      color: !!this.colorSpinner ? this.colorSpinner : 'primary',
      diameter: (this.diameterSpinner !== undefined && this.diameterSpinner !== null) ? this.diameterSpinner : 100,
      strokeWidth: (this.strokeWidthSpinner !== undefined && this.strokeWidthSpinner !== null) ? this.strokeWidthSpinner : 5,
    };

    // When the tab is changed, get the groups to display
    this.groups = this.analyticsService.getActiveGroups();
    this.tabChangeSubscription = this.analyticsService.tabChange.subscribe(() => {
      this.groups = this.analyticsService.getActiveGroups();
    });

  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.target && changes.groups === undefined) {
      this.scrollToAnalyticsComponent(changes.target.currentValue);
    }
  }

  public ngAfterViewInit() {
    this.scrollToAnalyticsComponent(this.target);
  }

  public scrollToAnalyticsComponent(target: string) {
    if (this.mode === 'normal' && target !== undefined) {
      const element = (<HTMLElement>document.getElementById(target));
      element.scrollIntoView(true);
    }
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

  public drop(event: CdkDragDrop<string[]>) {
    this.analyticsService.dropGroup(event);
  }

  public changeMode(event) {
    this.modeChange.next(event);
  }

  public removeFilter(groupId: string, event: any) {
    this.analyticsService.removeFilter(groupId);
    event.stopPropagation();
  }

  public getContributorStatus(id: string) {
    return this.collaborativeService.registry.get(id).isDataUpdating;
  }

  public openPanel(group: AnalyticGroupConfiguration) {
    this.analyticsService.openPanel(group);
  }

  public closePanel(group: AnalyticGroupConfiguration) {
    this.analyticsService.closePanel(group);
  }

  public ngOnDestroy(): void {
    if (this.tabChangeSubscription) {
      this.tabChangeSubscription.unsubscribe();
    }
  }
}
