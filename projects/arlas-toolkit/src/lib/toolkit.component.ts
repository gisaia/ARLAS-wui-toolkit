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

import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { interval } from 'rxjs';
import {
  ArlasCollaborativesearchService, ArlasStartupService, ArlasConfigService
} from './services/startup/startup.service';

import { CONFIG_ID_QUERY_PARAM } from './tools/utils';
import { take } from 'rxjs/operators';
@Component({
  selector: 'arlas-tool-root',
  templateUrl: './toolkit.component.html',
  providers: [Location],
  styleUrls: ['./toolkit.component.css']
})
export class ToolkitComponent implements AfterViewInit, OnInit {

  public analytics: Array<any>;
  public languages: string[];
  public analyticsOpen = false;
  public target: string;

  public constructor(private configService: ArlasConfigService,
    private arlasStartupService: ArlasStartupService,
    private collaborativeService: ArlasCollaborativesearchService,
    private activatedRoute: ActivatedRoute, private router: Router, private location: Location) {

    // update url when filter are setted
    const queryParams: Params = Object.assign({}, this.activatedRoute.snapshot.queryParams);
    if (!this.arlasStartupService.emptyMode) {
      this.collaborativeService.collaborationBus.subscribe(collaborationEvent => {
        queryParams['filter'] = this.collaborativeService.urlBuilder().split('filter=')[1];
        if (this.activatedRoute.snapshot.queryParams['lg']) {
          queryParams['lg'] = this.activatedRoute.snapshot.queryParams['lg'];
        }
        if (this.activatedRoute.snapshot.queryParams['extend']) {
          queryParams['extend'] = this.activatedRoute.snapshot.queryParams['extend'];
        }
        if (this.activatedRoute.snapshot.queryParams[CONFIG_ID_QUERY_PARAM]) {
          queryParams[CONFIG_ID_QUERY_PARAM] = this.activatedRoute.snapshot.queryParams[CONFIG_ID_QUERY_PARAM];
        }
        if (this.activatedRoute.snapshot.queryParams['vs']) {
          queryParams['vs'] = this.activatedRoute.snapshot.queryParams['vs'];
        }
        /** at = analytic-tab */
        if (this.activatedRoute.snapshot.queryParams['at']) {
          queryParams['at'] = this.activatedRoute.snapshot.queryParams['at'];
        }
        /** rt = resultlist-tab */
        if (this.activatedRoute.snapshot.queryParams['rt']) {
          queryParams['rt'] = this.activatedRoute.snapshot.queryParams['rt'];
        }
        /** ao = analytic-open */
        if (this.activatedRoute.snapshot.queryParams['ao']) {
          queryParams['ao'] = this.activatedRoute.snapshot.queryParams['ao'];
        }
        /** ro = resultlist-open */
        if (this.activatedRoute.snapshot.queryParams['ro']) {
          queryParams['ro'] = this.activatedRoute.snapshot.queryParams['ro'];
        }
        this.router.navigate(['.'], { queryParams: queryParams });
        if (collaborationEvent.id !== 'url') {
        }
      });
    }

  }

  public ngOnInit(): void {
    // update app when user click on back/next browser button
    this.location.subscribe(x => {
      if (!this.arlasStartupService.emptyMode) {
        let dataModel = {};
        x.url.split('&').forEach(param => {
          if (param.split('filter=')[1]) {
            dataModel = this.collaborativeService.dataModelBuilder(decodeURI(param.split('filter=')[1]), true);
          }
        });
        this.collaborativeService.setCollaborations(dataModel);
      }
    });
    // this.collaborativeService.setCollaborations({});
    // this.analytics = this.arlasStartupService.analytics;
    // this.languages = ['en', 'fr', 'it', 'es', 'de', 'us', 'cn'];
  }

  public ngAfterViewInit(): void {
    if (this.configService.getConfig() && this.configService.getConfig()['error'] !== undefined) {
      this.configService.confErrorBus.next(this.configService.getConfig()['error']);
    } else if (this.arlasStartupService.shouldRunApp) {
      interval(400).pipe(take(1)).subscribe(() => {
        const filter = this.activatedRoute.snapshot.queryParams['filter'];
        if (filter) {
          const dataModel = this.collaborativeService.dataModelBuilder(filter, true);
          this.collaborativeService.setCollaborations(dataModel);
        } else {
          this.collaborativeService.setCollaborations({});
        }
      });
    }
  }

  public openAnalytics(event) {
    this.target = 'analytics-panel-' + event;
    this.analyticsOpen = true;
  }

}
