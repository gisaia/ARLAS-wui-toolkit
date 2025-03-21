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
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Filter } from 'arlas-api';
import { Configuration, FetchAPI, StatusApi, TagRefRequest, WriteApi } from 'arlas-tagger-api';
import { from, interval, Observable, Subject, Subscription } from 'rxjs';
import { GET_OPTIONS } from '../../tools/utils';
import { AuthentificationService } from '../authentification/authentification.service';
import { ArlasCollaborativesearchService } from '../collaborative-search/arlas.collaborative-search.service';
import { ArlasSettingsService } from '../settings/arlas.settings.service';
import { ArlasConfigService } from '../startup/startup.service';
import { TaggerResponse } from './model';

@Injectable()
export class ArlasTaggerWriteApi extends WriteApi {
  public constructor(@Inject('CONF') conf: Configuration, @Inject('base_path') basePAth: string,
    @Inject('fetch') fetch: FetchAPI) {
    super(conf, basePAth, fetch);
  }
}

@Injectable()
export class ArlasTaggerStatusApi extends StatusApi {
  public constructor(@Inject('CONF') conf: Configuration, @Inject('base_path') basePAth: string,
    @Inject('fetch') fetch: FetchAPI) {
    super(conf, basePAth, fetch);
  }
}

/** Constants used to fill up our data base. */
@Injectable()
export class ArlasTagService implements OnDestroy {

  public taggableFields: Array<any> = [];
  public isProcessing = false;
  public status: Subject<Map<string, boolean>> = new Subject<Map<string, boolean>>();
  public processStatus: Map<string, TaggerResponse> = new Map<string, TaggerResponse>();
  private taggerApi: ArlasTaggerWriteApi;
  private statusApi: ArlasTaggerStatusApi;
  private options;

  private tagger: any;
  private onGoingSubscription: Map<string, Subscription> = new Map<string, Subscription>();


  public constructor(
    @Inject(GET_OPTIONS) private getOptions,
    private collaborativeSearchService: ArlasCollaborativesearchService,
    private configService: ArlasConfigService,
    private snackBar: MatSnackBar,
    private authService: AuthentificationService,
    private arlasSettingsService: ArlasSettingsService
  ) {
    // for now, the ARLAS-tagger url  and collection name are fetched from the config.
    // we should keep doing it for now, otherwise we will have two sources (settings.yaml (it was env.js) & config.json) to configure
    // the taggger, and this can lead to incoherences
    this.setOptions(this.getOptions());
    const configuration: Configuration = new Configuration();
    this.tagger = this.configService.getValue('arlas.tagger');
    const settings = this.arlasSettingsService.settings;
    if (this.tagger && this.tagger.url) {
      this.taggerApi = new ArlasTaggerWriteApi(configuration, this.tagger.url, window.fetch);
      this.statusApi = new ArlasTaggerStatusApi(configuration, this.tagger.url, window.fetch);
      const useAuthent = !!settings && !!settings.authentication && !!settings.authentication.use_authent;
      if (useAuthent) {
        this.authService.canActivateProtectedRoutes.subscribe(isActivable => {
          if (isActivable) {
            this.setOptions({
              headers: {
                Authorization: 'bearer ' + this.authService.accessToken
              }
            });
          }
        });
      }
    }
  }

  public addTag(path: string, value: string | number, propagateField?: string, propagateUrl?: string, operationName?: string) {
    if (!operationName) {
      operationName = 'TAG ' + Math.round(Date.now() / 1000);
    }
    const data = this.createPayload(operationName, path, value);
    if (propagateField) {
      data.propagation = this.createPropagationPayload(propagateField, propagateUrl);
    }
    this.postTagData(data);
  }

  public removeTag(path: string, value?: string | number, propagateField?: string, propagateUrl?: string, operationName?: string) {
    if (!operationName) {
      operationName = 'UNTAG ' + Math.round(Date.now() / 1000);
    }
    const data = this.createPayload(operationName, path, value);
    if (propagateField) {
      data.propagation = this.createPropagationPayload(propagateField, propagateUrl);
    }
    this.postTagData(data, 'untag');
  }

  public createPayload(label: string, path: string, value?: string | number): { search: any; tag?: any; label?: string; propagation?: any; } {

    const filters = new Array<Filter>();
    this.collaborativeSearchService.collaborations.forEach(element => {
      if (!!element.filters) {
        element.filters.forEach((filter, collection) => {
          filters.push(filter[0]);

        });
      }
    });
    const filter = this.collaborativeSearchService.getFinalFilter(filters);

    const data: { search: any; tag?: any; propagation?: any; label?: string; } = { search: {} };
    data.search = { filter: filter };
    const tag: { path: string; value?: string | number; } = { path: '' };
    tag.path = path;
    if (value) {
      tag.value = value;
    }
    data.tag = tag;
    data.label = label;
    return data;
  }

  public createPropagationPayload(propagateField?: string, propagateUrl?: string) {

    const propagation: { field: string; filter?: any; } = { field: '' };
    propagation.field = propagateField;
    if (propagateUrl) {
      const dataModel = this.collaborativeSearchService.dataModelBuilder(decodeURI(propagateUrl));
      const filters = new Array<Filter>();

      Object.values(dataModel).forEach((element: any) => {
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
      from(this.taggerApi.tagPost(this.tagger.collection, data, false, this.options)).subscribe(
        (response: TaggerResponse) => {
          this.snackBar.open('Tag task running', '', snackConfig);
          this.status.next(new Map<string, boolean>().set(mode, true));
          const subscription = interval(5000).subscribe(() => {
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
      from(this.taggerApi.untagPost(this.tagger.collection, data, false, this.options)).subscribe(
        (response: TaggerResponse) => {
          this.snackBar.open('Untag task running', '', snackConfig);
          this.status.next(new Map<string, boolean>().set(mode, true));
          const subscription = interval(5000).subscribe(() => {
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
    from(this.statusApi.taggingGet(this.tagger.collection, response.id, false, this.options)).subscribe(
      (response: TaggerResponse) => {
        this.processStatus.set(response.id, response);
        if (response.progress === 100) {
          this.onGoingSubscription.get(response.id).unsubscribe();
        }
      }
    );
  }

  public list(): Observable<TagRefRequest[]> {
    return from(this.statusApi.taggingGetList(this.tagger.collection, false, this.options));
  }

  public unfollowStatus(responseId: string) {
    this.processStatus.delete(responseId);
  }
  public setOptions(options): void {
    this.options = options;
  }

  public ngOnDestroy(): void {
    this.onGoingSubscription.forEach((subscription, k) => {
      subscription.unsubscribe();
    });
  }
}
