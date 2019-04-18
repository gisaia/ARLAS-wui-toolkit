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

import { Component, Input, Output, OnInit, AfterViewInit, Renderer2, OnChanges, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { AnalyticGroupConfiguration } from './analytics.utils';
import { ArlasCollaborativesearchService } from '../../services/startup/startup.service';
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
  @Output() public boardOutputs: Subject<{ origin: string, event: string, data?: any }>
    = new Subject<{ origin: string, event: string, data?: any }>();

  @Output() public modeChange: Subject<string> = new Subject<string>();

  private compGroup: Map<string, string> = new Map<string, string>();
  public activeFilter: Map<string, boolean> = new Map<string, boolean>();

  constructor(private collaborativeService: ArlasCollaborativesearchService, private renderer: Renderer2) { }

  public ngOnInit() {

    if (!this.groupsDisplayStatusMap && this.groups) {
      this.groupsDisplayStatusMap = new Map<string, boolean>();
      this.groups.forEach(group => this.groupsDisplayStatusMap.set(group.groupId, true));
    }

    if (this.groups) {
      this.groups.forEach(group =>
        group.components.forEach(comp => {
          this.compGroup.set(comp.contributorId, group.groupId);
        }));
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
}
