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
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';
import { ArlasCollaborativesearchService } from './services/collaborative-search/arlas.collaborative-search.service';
import { ErrorService } from './services/error/error.service';
import { ArlasConfigService, ArlasStartupService } from './services/startup/startup.service';
import { ArlasWalkthroughService } from './services/walkthrough/walkthrough.service';

@Component({
  selector: 'arlas-tool-root',
  styleUrls: ['./toolkit.component.scss'],
  template: ''
})
export class ToolkitComponent implements AfterViewInit, OnInit, OnDestroy {

  public analyticsOpen = false;

  public constructor(
    private readonly configService: ArlasConfigService,
    private readonly arlasStartupService: ArlasStartupService,
    private readonly collaborativeService: ArlasCollaborativesearchService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly location: Location,
    private readonly walkthroughService: ArlasWalkthroughService,
    private readonly errorService: ErrorService
  ) {
    if (!this.arlasStartupService.emptyMode) {
      this.collaborativeService.collaborationBus.subscribe(collaborationEvent => {
        // update url when filter are set
        const queryParams: Params = { ...this.activatedRoute.snapshot.queryParams };
        queryParams['filter'] = this.collaborativeService.urlBuilder().split('filter=')[1];
        this.router.navigate([], { queryParams: queryParams, relativeTo: this.activatedRoute });
        this.collaborativeService.ongoingSubscribe.subscribe(nb => {
          if (collaborationEvent.id === 'url') {
            if (!this.collaborativeService.endOfUrlCollaboration) {
              this.collaborativeService.endOfUrlCollaboration = this.collaborativeService.totalSubscribe === 0;
            }
          }
        });
        if (collaborationEvent.id !== 'url') {
          this.collaborativeService.endOfUrlCollaboration = true;
        }
      });
    }

    this.errorService.listenToArlasCollaborativeErrors();
  }

  public ngOnInit(): void {
    // update app when user click on back/next browser button
    this.location.subscribe(x => {
      if (!this.arlasStartupService.emptyMode) {
        let dataModel = {};
        x.url?.split('&').forEach(param => {
          if (param.split('filter=')[1]) {
            dataModel = this.collaborativeService.dataModelBuilder(decodeURI(param.split('filter=')[1]), true);
          }
        });
        this.collaborativeService.setCollaborations(dataModel);
      }
    });
  }

  public ngAfterViewInit(): void {
    const config = this.configService.getConfig() as Record<string, any>;
    if (config?.['error'] !== undefined) {
      this.configService.confErrorBus.next(config['error']);
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
    this.walkthroughService.load();
  }

  public ngOnDestroy(): void {
    this.errorService.unlistenToArlasCollaborativeErrors();
  }
}
