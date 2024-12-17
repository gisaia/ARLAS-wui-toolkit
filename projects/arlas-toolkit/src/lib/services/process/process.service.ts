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
import { Expression, Filter, Search } from 'arlas-api';
import { projType } from 'arlas-web-core';
import { map, Observable } from 'rxjs';
import { ProcessInputs, ProcessOutput } from '../../tools/process.interface';
import { ArlasCollaborativesearchService } from '../collaborative-search/arlas.collaborative-search.service';
import { ArlasSettingsService } from '../settings/arlas.settings.service';

@Injectable({
  providedIn: 'root'
})
export class ProcessService {
  private processInputs: ProcessInputs = {};
  private options: any = {};

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
  public process(processName: string, ids: string[], payload: any, collection: string): Observable<ProcessOutput> {
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

    return this.http.post(
      this.arlasSettingsService.getProcessSettings(processName)?.url, data,
      Object.assign(this.options, { responseType: 'text' })
    )
      .pipe(map(
        p => {
          const processOutput: ProcessOutput = JSON.parse(p as any);
          return processOutput;
        }
      ));
  }

  public check(processName: string): Observable<any> {
    return this.http.get(this.arlasSettingsService.getProcessSettings(processName)?.check_url, this.options);
  }

  public getProcessInputs(): ProcessInputs {
    return this.processInputs;
  }

  public setProcessInputs(process: ProcessInputs): void {
    this.processInputs = process;
  }

  public load(processName: string): Observable<ProcessInputs> {
    return this.http.get(
      this.arlasSettingsService.getProcessSettings(processName)?.settings.url,
      Object.assign(this.options, { responseType: 'text' })
    )
      .pipe(
        map(c => {
          const process: ProcessInputs = JSON.parse(c as any);
          this.setProcessInputs(process);
          return process;
        })
      );
  }

  public getJobStatus(processName: string, jobId: string): Observable<ProcessOutput> {
    return this.http.get(
      this.arlasSettingsService.getProcessSettings(processName).status.url + '/' + jobId,
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
    collection: string
  ): Observable<Map<string, any>> {
    // properties.main_asset_format its the field to pass to get the object value
    const fields = ['properties.proj__epsg', 'properties.main_asset_format', 'geometry', 'properties.item_format'];
    const search: Search = {
      page: { size: itemsId.length },
      form: { pretty: false, flat: false },
      projection: {
        includes: fields.map(field => field).join(',')
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
        false
      );
    return searchResult.pipe(map((data: any) => {
      const matchingAdditionalParams = new Map<string, any>();
      if (!!data && !!data?.hits && data.hits.length > 0) {
        const regexReplacePoint = /\./gi;
        data.hits.forEach(i => {
          const itemMetadata = i.data;
          fields.forEach(f => {
            matchingAdditionalParams.set(f, this.resolve(f,itemMetadata));
          });
        });
      }
      return matchingAdditionalParams;
    }));
  }

  private resolve(path, obj = self, separator = '.') {
    const properties = Array.isArray(path) ? path : path.split(separator);
    return properties.reduce((prev, curr) => prev?.[curr], obj);
  }
}
