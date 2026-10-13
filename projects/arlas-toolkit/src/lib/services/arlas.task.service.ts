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
import { inject, Injectable } from '@angular/core';
import { DEFAULT_TASK_RETRIEVAL_INTERVAL, TaskSettings, TaskSettingsService } from 'arlas-web-components';
import { Task, TaskService } from 'arlas-web-contributors';
import { Observable, of } from 'rxjs';
import { GET_OPTIONS, GetOptions } from '../tools/utils';

@Injectable({
  providedIn: 'root',
})
export class ArlasTaskService implements TaskService, TaskSettingsService {
  private readonly http = inject(HttpClient);
  private options: GetOptions = {};
  private readonly getOptions = inject(GET_OPTIONS);

  private readonly services = new Map<string, TaskSettings>();

  public constructor() {
    this.setOptions(this.getOptions());
  }

  public setOptions(options: GetOptions): void {
    this.options = options;
  }

  public addService(settings: TaskSettings) {
    if (!settings.enabled) {
      return;
    }

    // Check if the user is allowed to fetch the jobs
    this.http.get(settings.url + '/jobs', this.options)
      .subscribe({
        next: () => {
          settings.taskRetrievalTimer ??= DEFAULT_TASK_RETRIEVAL_INTERVAL;
          this.services.set(settings.service, settings);
        },
        error: (e) => {
          console.warn(`[ARLAS][TASK] Service ${settings.service} is not available for tasks retrieval`);
        }
      });
  }

  public getServiceTaskSettings(service: string) {
    return this.services.get(service);
  }

  public getServiceTasks(collection: string, identifier: string, service: string): Observable<Task[]> {
    const settings = this.services.get(service);
    if (!settings?.collections.includes(collection)) {
      return of([]);
    }

    return this.http.get(settings.url + '/jobs/resources/' + identifier, this.options) as Observable<Task[]>;
  }

  public getAllTasks(collection: string, identifier: string): Map<string, Observable<Task[]>> {
    const taskMap$ = new Map();
    this.services.keys().forEach(service => {
      taskMap$.set(service, this.getServiceTasks(collection, identifier, service));
    });

    return taskMap$;
  }
}
