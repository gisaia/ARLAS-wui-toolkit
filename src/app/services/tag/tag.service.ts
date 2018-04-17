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
import { Injectable } from '@angular/core';
import { Headers, Http, RequestMethod, RequestOptions } from '@angular/http';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { ArlasCollaborativesearchService, ArlasConfigService } from '../startup/startup.service';
import { Observable } from 'rxjs/Observable';

/** Constants used to fill up our data base. */
@Injectable()
export class ArlasTagService {
  private server: any;
  public taggableFields: Array<any> = [];

  constructor(
    private collaborativeSearchService: ArlasCollaborativesearchService,
    private configService: ArlasConfigService,
    private http: Http,
    private snackBar: MatSnackBar,
  ) {
    this.server = this.configService.getValue('arlas.server');
  }

  public addTag(path: string, value: string) {
    const search = this.getCurrentFilter();
    const data = this.createPayload(search, path, value);
    this.postTagData(data);
  }

  public removeTag(path: string, value: string) {
    const search = this.getCurrentFilter();
    const data = this.createPayload(search, path, value);
  }

  public removeAllTag(path: string) {
    const search = this.getCurrentFilter();
    const data = this.createPayload(search, path);

  }

  public getCurrentFilter(): Object {
    const url = this.collaborativeSearchService.urlBuilder().split('filter=')[1];
    return this.collaborativeSearchService.dataModelBuilder(decodeURI(url));
  }

  public createPayload(search: any, path: string, value?: string | number): Object {
    const data: { search: any, tag?: any } = { search: {} };
    data.search = search;
    const tag: { path: string, value?: string | number } = { path: '' };
    tag.path = path;
    if (value) {
      tag.value = value;
    }
    data.tag = tag;
    return data;
  }

  public postTagData(data: any, mode: string = 'tag') {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    const requestOptions = new RequestOptions(
      {
        method: RequestMethod.Post,
        headers: headers
      }
    );

    const snackConfig = new MatSnackBarConfig();
    snackConfig.extraClasses = ['custom-class'];
    snackConfig.duration = 10000;
    snackConfig.verticalPosition = 'top';

    this.http.post(this.server.url + '/write/' + this.server.collection.name + '/_' + mode, JSON.stringify(data), requestOptions).map(
      response => {
        let snackBarRef;

        switch (response.status) {
          case 200:
            snackBarRef = this.snackBar.open('Job request successfully launched', 'Open jobs dashboard', snackConfig);
            break;
          case 201:
            snackBarRef = this.snackBar.open('Job request queued', 'Open jobs dashboard', snackConfig);
            break;
        }
      }).subscribe(
        response => { },
        error => {
          this.collaborativeSearchService.collaborationErrorBus.next(error);
        }
      );
  }
}
