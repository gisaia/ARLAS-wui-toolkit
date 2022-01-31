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
import { ArlasCollaborativesearchService, ArlasStartupService } from '../../projects/arlas-toolkit/src/lib/services/startup/startup.service';



@Component({
  selector: 'arlas-tool-root',
  templateUrl: './app.component.html',
  providers: [Location],
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public analytics: Array<any>;
  public languages: string[];
  public analyticsOpen = false;
  public target: string;

  public constructor(
    private arlasStartupService: ArlasStartupService,
    private collaborativeService: ArlasCollaborativesearchService,
  ) {
  }

  public ngOnInit(): void {

    this.collaborativeService.setCollaborations({});
    this.analytics = this.arlasStartupService.analytics;
    this.languages = ['en', 'fr', 'it', 'es', 'de', 'us', 'cn'];
  }
}
