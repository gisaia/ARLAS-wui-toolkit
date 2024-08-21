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

import { Inject, Injectable } from '@angular/core';
import { Configuration, DataResource, DataWithLinks, Exists, PersistApi } from 'arlas-persistence-api';
import { Observable } from 'rxjs/internal/Observable';
import { from } from 'rxjs/internal/observable/from';
import { map, mergeMap } from 'rxjs/operators';
import { GET_OPTIONS } from '../../tools/utils';
import { ArlasSettingsService } from '../settings/arlas.settings.service';

@Injectable({
  providedIn: 'root'
})
export class PersistenceService {
  private persistenceApi: PersistApi;
  public options;
  public isAvailable = false;

  public constructor(
    @Inject(GET_OPTIONS) private getOptions,
    private settingsService: ArlasSettingsService
  ) {
    this.setOptions(this.getOptions());
    this.createPersistenceApiInstance();
  }

  public createPersistenceApiInstance(): void {
    const persistenceSettings = this.settingsService.getPersistenceSettings();
    if (!this.persistenceApi && !!persistenceSettings) {
      const configuration = new Configuration();
      this.persistenceApi = new PersistApi(configuration, persistenceSettings.url, window.fetch);
      this.isAvailable = true;
    }
  }

  public delete(id: string, options = this.options): Observable<DataWithLinks> {
    return from(this.persistenceApi.deleteById(id, false, options));
  }

  public create(zone: string, name: string, body: string,
    readers?: string[], writers?: string[], options = this.options): Observable<DataWithLinks> {
    return from(this.persistenceApi.create(body, zone, name, readers, writers, false, options));

  }
  public get(id: string, options = this.options): Observable<DataWithLinks> {
    return from(this.persistenceApi.getById(id, false, options));
  }

  public exists(id: string, options = this.options): Observable<Exists> {
    return from(this.persistenceApi.existsById(id, false, options));
  }

  public list(zone: string, size: number, page: number, order: string, options = this.options): Observable<DataResource> {
    return from(this.persistenceApi.list(zone, size, page, order, false, options));

  }
  public update(id: string, body: string, lastUpdate: number, name?: string,
    readers?: string[], writers?: string[], options = this.options): Observable<DataWithLinks> {
    return from(this.persistenceApi.update(body, id, lastUpdate, name, readers, writers, false, options));
  }

  public duplicate(zone: string, id: string, newName?: string, options = this.options): Observable<DataWithLinks> {
    return this.get(id, options).pipe(
      map(data => this.create(zone, newName ? newName : 'Copy of ' + data.doc_key, data.doc_value, [], [],
        options)),
      mergeMap(a => a)
    );
  }

  public rename(id: string, newName: string, options = this.options): Observable<DataWithLinks> {
    return this.get(id, options).pipe(
      map(data => this.update(id, data.doc_value, new Date(data.last_update_date).getTime(),
        newName, data.doc_readers, data.doc_writers, options)),
      mergeMap(a => a)
    );
  }

  public getGroupsByZone(zone: string, options = this.options) {
    return from(this.persistenceApi.getGroupsByZone(zone, false, options));
  }

  public setOptions(options): void {
    this.options = options;
  }

  /** updates the resource's name, readers and writers */
  public updateResource(id: string, readers: string[], writers: string[], newValue?: string, options = this.options) {
    this.exists(id, options).subscribe(
      exist => {
        if (exist.exists) {
          this.get(id, options).subscribe({
            next: (data) => {
              this.update(data.id, newValue ? newValue : data.doc_value, new Date(data.last_update_date).getTime(), data.doc_key,
                readers, writers, options).subscribe();
            }
          });
        }
      });
  }

  public renameResource(id: string, newName: string, options = this.options) {
    this.exists(id, options).subscribe(
      exist => {
        if (exist.exists) {
          this.get(id, options).subscribe({
            next: (data) => {
              this.rename(data.id, newName, options).subscribe();
            }
          });
        }
      });
  }

  public dashboardToResourcesGroups(dashboardReaders: string[], dashboardWiters: string[]): {
    readers: string[];
    writers: string[];
  } {
    let resourceReaders = [];
    let resourceWriters = [];
    if (dashboardReaders) {
      // Seen with AB who says normally we dont need to do the replace anymore
      resourceReaders = dashboardReaders;
    }
    if (dashboardWiters) {
      // Seen with AB who says normally we dont need to do the replace anymore
      resourceWriters = dashboardWiters;
    }
    return {
      readers: resourceReaders,
      writers: resourceWriters
    };
  }

  public getOptionsSetOrg(org: string) {
    const newOptions = Object.assign({}, this.options);
    if (newOptions.headers) {
      newOptions.headers = Object.assign({}, newOptions.headers);
    }
    // No need to have arlas-org-filer headers to delete or get by id
    if (!!newOptions && !!newOptions['headers']) {
      newOptions.headers['arlas-org-filter'] = org;
    }
    return newOptions;
  }

  /** deletes the resource by its id */
  public deleteResource(previewId: string, options = this.options) {
    this.exists(previewId, options).subscribe(
      exist => {
        if (exist.exists) {
          this.delete(previewId, options).subscribe();
        }
      });
  }
}

export interface PersistenceSetting {
  use_local_config?: boolean;
  url: string;
}
