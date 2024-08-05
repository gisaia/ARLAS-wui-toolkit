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

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Process, ProcessOutput } from '../../tools/process.interface';
import { ArlasSettingsService } from '../settings/arlas.settings.service';
import { Expression, Search, Filter } from 'arlas-api';
import { projType } from 'arlas-web-core';
import { ArlasCollaborativesearchService } from '../startup/startup.service';

@Injectable({
  providedIn: 'root'
})
export class ProcessService {
  private processDescription: Process = {};
  private options;

  public constructor(
    private http: HttpClient,
    private arlasSettingsService: ArlasSettingsService,
    private collaborativeSearchService: ArlasCollaborativesearchService
  ) { }

  public setOptions(options): void {
    this.options = options;
  }

  /**
   *
   * @param ids List of products ids
   * @param payload Values of the dynamic form
   * @param collection Collection of selectied items
   */
  public process(ids: string[], payload: any, collection: string): Observable<ProcessOutput> {
    const requests: any[] = [];
    ids.forEach(id => {
      requests.push({ collection, item_id: id });
    });
    const data = {
      inputs: {
        requests
      }
    };
    data.inputs = Object.assign(data.inputs, payload);
    return this.http.post(this.arlasSettingsService.getProcessSettings()?.url, data, Object.assign(this.options, { responseType: 'text' }))
      .pipe(map(
        p => {
          const processOutput: ProcessOutput = JSON.parse(p as any);
          return processOutput;
        }
      ));
  }

  public check(): Observable<any> {
    return this.http.get(this.arlasSettingsService.getProcessSettings()?.check_url, this.options);
  }

  public getProcessDescription(): Process {
    return this.processDescription;
  }

  public setProcessDescription(process: Process): void {
    this.processDescription = process;
  }

  public load(): Observable<Process> {
    return this.http.get(this.arlasSettingsService.getProcessSettings()?.settings.url, Object.assign(this.options, { responseType: 'text' }))
      .pipe(
        map(c => {
          const process: Process = JSON.parse(c as any);
          this.setProcessDescription(process);
          return process;
        })
      );
  }

  public getJobStatus(jobId: string): Observable<ProcessOutput> {
    return this.http.get(
      this.arlasSettingsService.getProcessSettings().status.url + '/' + jobId,
      Object.assign(this.options, { responseType: 'text' })
    )
      .pipe(map(
        p => {
          const processOutput: ProcessOutput = JSON.parse(p as any);
          return processOutput;
        }
      ));
  }

  public getItemsDetail(
    idFieldName,
    itemsId: string[],
    additionalParams: any[],
    collection: string
  ): Observable<Map<string, boolean>> {
    const search: Search = {
      page: { size: itemsId.length },
      form: { pretty: false, flat: true },
      projection: {
        includes: additionalParams.map(p => p.value.field).join(',')
      }
    };
    const expression: Expression = {
      field: idFieldName,
      // TODO: Manage other Operators ?
      op: Expression.OpEnum.Eq,
      value: itemsId.join(',')
    };
    const filterExpression: Filter = {
      f: [[expression]]
    };
    const searchResult = this.collaborativeSearchService
      .resolveHits(
        [projType.search, search],
        this.collaborativeSearchService.collaborations,
        collection,
        undefined,
        filterExpression,
        true
      );
    return searchResult.pipe(map((data: any) => {

      const matchingAdditionalParams = new Map<string, boolean>();
      if (!!data && !!data?.hits && data.hits.length > 0) {
        const regexReplacePoint = /\./gi;
        data.hits.forEach(i => {
          const itemMetadata = i.data;
          additionalParams.forEach(f => {
            const flattenField = f.value.field.replace(regexReplacePoint, '_');
            if (f.value.value === itemMetadata[flattenField]) {
              matchingAdditionalParams.set(f.name, true);
            }
          });
        });
      }
      return matchingAdditionalParams;
    }));
  }
}
