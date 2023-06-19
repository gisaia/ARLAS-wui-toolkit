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

import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TimelineConfiguration } from '../../projects/arlas-toolkit/src/lib/components/timeline/timeline/timeline.utils';
import {
  ArlasCollaborativesearchService, ArlasConfigService, ArlasStartupService
} from '../../projects/arlas-toolkit/src/lib/services/startup/startup.service';
import { FilterShortcutConfiguration } from '../../projects/arlas-toolkit/src/lib/components/filter-shortcut/filter-shortcut.utils';
import packageJson from '../../package.json';



@Component({
  selector: 'arlas-tool-app',
  templateUrl: './app.component.html',
  providers: [Location],
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public analytics: Array<any>;
  public shortcuts: Array<FilterShortcutConfiguration>;
  public languages: string[];
  public analyticsOpen = false;
  public target: string;
  public timelineComponentConfig: TimelineConfiguration;
  public detailedTimelineComponentConfig: TimelineConfiguration;

  public lastShortcutOpen: number;

  public version: string;

  public constructor(
    private arlasStartupService: ArlasStartupService,
    private arlasConfigService: ArlasConfigService,

    private collaborativeService: ArlasCollaborativesearchService,
  ) {
  }

  public ngOnInit(): void {

    this.analytics = this.arlasStartupService.analytics;
    this.shortcuts = this.arlasStartupService.filtersShortcuts;
    this.languages = ['en', 'fr', 'it', 'es', 'de', 'us', 'cn'];
    this.timelineComponentConfig = this.arlasConfigService.getValue('arlas.web.components.timeline');
    this.detailedTimelineComponentConfig = this.arlasConfigService.getValue('arlas.web.components.detailedTimeline');

    this.version = packageJson.version;
  }

  public onOpen(event: boolean, idx: number): void {
    if (event) {
      this.lastShortcutOpen = idx;
    }
  }
}
