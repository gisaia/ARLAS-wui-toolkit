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
import { map, Observable, of } from 'rxjs';
import { Process, ProcessFieldOption, ProcessInputs, ProcessOutput } from '../../tools/process.interface';
import { GetOptions } from '../../tools/utils';
import { ArlasCollaborativesearchService } from '../collaborative-search/arlas.collaborative-search.service';
import { ArlasSettingsService } from '../settings/arlas.settings.service';

export interface ValidatedProcessFieldOption extends ProcessFieldOption {
  valid$: Observable<boolean>;
}

@Injectable({
  providedIn: 'root'
})
export class ProcessService {
  private readonly processInputs = new Map<string, ProcessInputs | undefined>();
  private options: GetOptions = {};

  public constructor(
    private readonly http: HttpClient,
    private readonly arlasSettingsService: ArlasSettingsService,
    private readonly collaborativeSearchService: ArlasCollaborativesearchService
  ) { }

  public setOptions(options: GetOptions): void {
    this.options = options;
  }

  private getProcessSettings(processName: string) {
    const settings = this.arlasSettingsService.getProcessSettings(processName);
    if (settings) {
      return settings;
    }

    throw new Error(`[ARLAS][PROCESS] No settings were found for process ${processName}`);
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
      this.getProcessSettings(processName).url, data,
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
    return this.http.get(this.getProcessSettings(processName).check_url, this.options);
  }

  public getProcessInputs(process: string): ProcessInputs | undefined {
    return this.processInputs.get(process);
  }

  public setProcessInputs(name: string, process: ProcessInputs | undefined): void {
    this.processInputs.set(name, process);
  }

  public load(processName: string): Observable<Process> {
    return this.http.get(
      this.getProcessSettings(processName).settings.url,
      Object.assign(this.options, { responseType: 'text' })
    )
      .pipe(
        map(c => {
          const process: Process = JSON.parse(c as any);
          this.setProcessInputs(processName, process.inputs);
          return process;
        })
      );
  }

  public getJobStatus(processName: string, jobId: string): Observable<ProcessOutput> {
    return this.http.get(
      this.getProcessSettings(processName).status.url + '/' + jobId,
      Object.assign(this.options, { responseType: 'text' })
    )
      .pipe(map(
        p => {
          const processOutput: ProcessOutput = JSON.parse(p as any);
          return processOutput;
        }
      ));
  }

  /**
   * Parses the inputs of a process to determine which options are valid for the selection of items
   * @param idFieldName Path to the id field
   * @param itemsId List of item ids
   * @param collection Name of the collection
   * @param processName Name of the process
   * @returns For each configured form field in the inputs, the validated options
   */
  public getValidOptions(idFieldName: string, itemsId: string[], collection: string, processName: string) {
    const inputs = this.processInputs.get(processName);
    const formOptions = new Map<string, ValidatedProcessFieldOption[]>();

    if (inputs) {
      const idMatchExpression: Expression = {
        field: idFieldName,
        op: Expression.OpEnum.Eq,
        value: itemsId.join(',')
      };

      Object.entries(inputs).forEach(e => {
        const [formField, input] = e;

        const parsedOptions = new Array<ValidatedProcessFieldOption>();
        if (input.schema.enum) {
          for (const option of input.schema.enum) {
            if (typeof option !== 'string') {
              if (option.if) {
                const search: Search = {
                  form: { pretty: false, flat: false },
                  projection: {
                    includes: [idFieldName, ...option.if.map(opt => opt.field)].join(',')
                  }
                };

                // Flatten all the filters to act as and
                const filter: Filter = {
                  f: [[idMatchExpression], ...option.if.map(e => [e])]
                };

                const optionValid$ = this.collaborativeSearchService
                  .resolveHits(
                    [projType.search, search],
                    this.collaborativeSearchService.collaborations,
                    collection,
                    undefined,
                    filter,
                    false)
                  .pipe(map(data => {
                    console.log(data);
                    return data.hits?.length === itemsId.length;
                  }));

                parsedOptions.push({ ...option, valid$: optionValid$ });
              } else {
                parsedOptions.push({ ...option, valid$: of(true) });
              }
            } else {
              parsedOptions.push({ label: option, value: option, valid$: of(true) });
            }
          }
        }

        formOptions.set(formField, parsedOptions);
      });
    }

    return formOptions;
  }
}
