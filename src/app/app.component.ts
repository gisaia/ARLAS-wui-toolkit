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

import { AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ArlasConfigService, ArlasCollaborativesearchService, ArlasStartupService } from './services/startup/startup.service';
import { MatDialogRef, MatDialog } from '@angular/material';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'arlas-tool-root',
  templateUrl: './app.component.html',
  providers: [Location],
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit, OnInit {

  public analytics: Array<any>;
  constructor(private configService: ArlasConfigService,
    private arlasStartupService: ArlasStartupService,
    private collaborativeService: ArlasCollaborativesearchService,
    private cdr: ChangeDetectorRef, private activatedRoute: ActivatedRoute,
    private router: Router, private location: Location,
    private translate: TranslateService) {

    // // i18n
    // translate.setDefaultLang('en');
    // translate.use('en').subscribe(
    //   () => console.log('Translation loaded'),
    //   err => console.log('Something wrong with translation'  + err)
    //  );

    // update url when filter are setted
    const queryParams: Params = Object.assign({}, this.activatedRoute.snapshot.queryParams);
    this.collaborativeService.collaborationBus.subscribe(collaborationEvent => {
      queryParams['filter'] = this.collaborativeService.urlBuilder().split('=')[1];
      if (collaborationEvent.id !== 'url') {
        this.router.navigate(['.'], { queryParams: queryParams });
      }
    });

  }

  public ngOnInit(): void {
    // update app when user click on back/next browser button
    this.location.subscribe(x => {
      const dataModel = this.collaborativeService.dataModelBuilder(decodeURI(x.url.split('filter=')[1]));
      this.collaborativeService.setCollaborations(dataModel);
    });
  }

  public ngAfterViewInit(): void {
    if (this.configService.getConfig()['error'] !== undefined) {
      this.configService.confErrorBus.next(this.configService.getConfig()['error']);
    } else {

      this.activatedRoute.queryParams
        .pairwise()
        .take(1)
        .timeoutWith(400, Observable.of('initWithoutFilter'))
        .subscribe((params) => {
          if (params.toString() === 'initWithoutFilter') {
            this.collaborativeService.setCollaborations({});
          } else {
            const dataModel = this.collaborativeService.dataModelBuilder(params[1]['filter']);
            this.collaborativeService.setCollaborations(dataModel);
          }
        });

      this.collaborativeService.setCollaborations({});
      this.analytics = this.arlasStartupService.analytics;
      this.cdr.detectChanges();
    }
  }
}
