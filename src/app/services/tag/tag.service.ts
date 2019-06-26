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
import { Injectable, OnDestroy } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { Filter, UpdateResponse } from 'arlas-api';
import { Subject, Subscription } from 'rxjs';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';
import { ArlasCollaborativesearchService, ArlasConfigService } from '../startup/startup.service';
import { HttpClient } from '@angular/common/http';

/** Constants used to fill up our data base. */
@Injectable()
export class ArlasTagService implements OnDestroy {

  public taggableFields: Array<any> = [];
  public isProcessing = false;
  public status: Subject<Map<string, boolean>> = new Subject<Map<string, boolean>>();
  public processStatus: Map<string, number> = new Map<string, number>();
  private tagger: any;
  private onGoingSubscription: Map<string, Subscription> = new Map<string, Subscription>();


  constructor(
    private collaborativeSearchService: ArlasCollaborativesearchService,
    private configService: ArlasConfigService,
    private snackBar: MatSnackBar,
    private http: HttpClient
  ) {
    this.tagger = this.configService.getValue('arlas.tagger');
  }

  public addTag(path: string, value: string | number, propagateField?: string, propagateUrl?: string) {

    const data = this.createPayload(path, value);
    data.label = 'TAG ' + Math.round(Date.now() / 1000);
    if (propagateField) {
      data.propagation = this.createPropagationPayload(propagateField, propagateUrl);
    }
    console.log(JSON.stringify( data));
    this.postTagData(data);
  }

  public removeTag(path: string, value?: string | number) {
    const data = this.createPayload(path, value);
    console.log(data);
    data.label = 'UNTAG ' + Math.round(Date.now() / 1000);
    this.postTagData(data, 'untag');
  }

  public createPayload(path: string, value?: string | number): { search: any, tag?: any, propagation?: any, label?: string } {

    const filters = new Array<Filter>();
    this.collaborativeSearchService.collaborations.forEach(element => {
      filters.push(element.filter);
    });
    const filter = this.collaborativeSearchService.getFinalFilter(filters);

    const data: { search: any, tag?: any, propagation?: any, label?: string } = { search: {} };
    data.search = { filter: filter };
    const tag: { path: string, value?: string | number } = { path: '' };
    tag.path = path;
    if (value) {
      tag.value = value;
    }
    data.tag = tag;
    return data;
  }

  public createPropagationPayload(propagateField?: string, propagateUrl?: string) {

    const propagation: { field: string, filter?: any } = { field: '' };
    propagation.field = propagateField;
    if (propagateUrl) {
      const dataModel = this.collaborativeSearchService.dataModelBuilder(decodeURI(propagateUrl));
      const filters = new Array<Filter>();

      Object.values(dataModel).forEach(element => {
        filters.push(element.filter);
      });
      propagation.filter = this.collaborativeSearchService.getFinalFilter(filters);
    }
    return propagation;
  }

  public postTagData(data: any, mode: string = 'tag') {

    const snackConfig = new MatSnackBarConfig();
    snackConfig.duration = 5000;
    snackConfig.verticalPosition = 'top';

    this.isProcessing = true;

    if (mode === 'tag') {
      this.http.post(this.tagger.url + '/write/' + this.tagger.collection.name + '/_tag', data).subscribe(
        (response: any) => {
          this.snackBar.open('Tag task running', '', snackConfig);
          this.status.next(new Map<string, boolean>().set(mode, true));
          const subscription = IntervalObservable.create(5000).subscribe(() => {
            this.followStatus(response);
          });
          this.onGoingSubscription.set(response.id, subscription);
        },
        error => {
          this.snackBar.open('Error : the tag has not been added', '', snackConfig);
          this.isProcessing = false;
          this.collaborativeSearchService.collaborationErrorBus.next(error);

          this.status.next(new Map<string, boolean>().set(mode, false));
        },
        () => {
          this.isProcessing = false;
        }
      );
    } else {
      this.http.post(this.tagger.url + '/write/' + this.tagger.collection.name + '/_untag', data).subscribe(
        (response: any) => {
          this.snackBar.open('Untag task running', '', snackConfig);
          this.status.next(new Map<string, boolean>().set(mode, true));
          const subscription = IntervalObservable.create(5000).subscribe(() => {
            this.followStatus(response);
          });
          this.onGoingSubscription.set(response.id, subscription);
        },
        error => {
          this.snackBar.open('Error : the tag has not been removed', '', snackConfig);
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

  public followStatus(response: any) {
    this.http.get(this.tagger.url + '/status/' + this.tagger.collection.name + '/_tag?id=' + response.id).subscribe(
      (response: any) => {
        console.log(response);
        this.processStatus.set(response.label, response.progress);
        if (response.progress === 100) {
          this.onGoingSubscription.get(response.id).unsubscribe();
        }
      }
    );
  }

  public ngOnDestroy(): void {
    this.onGoingSubscription.forEach((subscription, k) => {
      subscription.unsubscribe();
    });
  }
}
