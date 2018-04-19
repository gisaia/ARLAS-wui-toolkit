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
import { Filter } from 'arlas-api';
import { Subject } from 'rxjs/Subject';
import { ArlasCollaborativesearchService, ArlasConfigService } from '../startup/startup.service';

/** Constants used to fill up our data base. */
@Injectable()
export class ArlasTagService {
  private server: any;
  public taggableFields: Array<any> = [];
  public isProcessing = false;
  public status: Subject<Map<string, boolean>> = new Subject<Map<string, boolean>>();

  constructor(
    private collaborativeSearchService: ArlasCollaborativesearchService,
    private configService: ArlasConfigService,
    private http: Http,
    private snackBar: MatSnackBar,
  ) {
    this.server = this.configService.getValue('arlas.server');
  }

  public addTag(path: string, value: string | number) {
    const data = this.createPayload(path, value);
    this.postTagData(data);
  }

  public removeTag(path: string, value?: string | number) {
    const data = this.createPayload(path, value);
    this.postTagData(data, 'untag');
  }

  public createPayload(path: string, value?: string | number): Object {

    const filters = new Array<Filter>();
    this.collaborativeSearchService.collaborations.forEach(element =>
      filters.push(element.filter)
    );
    const filter = this.collaborativeSearchService.getFinalFilter(filters);

    const data: { search: any, tag?: any } = { search: {} };
    data.search = { filter: filter };
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
    snackConfig.duration = 5000;
    snackConfig.verticalPosition = 'top';

    this.isProcessing = true;
    this.http.post(this.server.url + '/write/' + this.server.collection.name + '/_' + mode, JSON.stringify(data), requestOptions).map(
      response => {

        switch (response.status) {
          case 200:
            this.snackBar.open('Field successfully ' + mode, '', snackConfig);
            break;
          case 201:
            this.snackBar.open('Action in queue', '', snackConfig);
            break;
        }

        this.status.next(new Map<string, boolean>().set(mode, true));
      }).subscribe(
        response => { },
        error => {
          this.snackBar.open('Error : field was not ' + mode, '', snackConfig);
          this.isProcessing = false;
          this.collaborativeSearchService.collaborationErrorBus.next(error);

          this.status.next(new Map<string, boolean>().set(mode, false));
        },
        () => {
          this.isProcessing = false;
        }
      );
  }
}
