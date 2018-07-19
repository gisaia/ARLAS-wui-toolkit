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

import { Component, Input, Output, OnInit } from '@angular/core';
import {
  MatCard, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle,
  MatExpansionPanelDescription, MatExpansionPanelState, MatIcon
} from '@angular/material';
import { Subject } from 'rxjs/Subject';
@Component({
  selector: 'arlas-analytics-board',
  templateUrl: './analytics-board.component.html',
  styleUrls: ['./analytics-board.component.css']
})
export class AnalyticsBoardComponent implements OnInit {

  @Input() public groups: Array<any>;
  /**
   * @description Map of <groupId, displayStatus> that informs which groupIds to display/hide
   */
  @Input() public groupsDisplayStatusMap: Map<string, boolean>;
  @Output() public boardOutputs: Subject<{ origin: string, event: string, data?: any }>
  = new Subject<{ origin: string, event: string, data?: any }>();
  constructor() { }

  public ngOnInit() {
    if (!this.groupsDisplayStatusMap && this.groups) {
      this.groupsDisplayStatusMap = new Map<string, boolean>();
      this.groups.forEach(group => this.groupsDisplayStatusMap.set(group.groupId, true));
    }
  }

  public listenOutput(event: { origin: string, event: string, data?: any }) {
    this.boardOutputs.next( event);
  }

}
