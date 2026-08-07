import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AvailableProcess, Task, TaskService } from 'arlas-web-contributors';
import { Observable, of } from 'rxjs';
import { GET_OPTIONS, GetOptions } from '../tools/utils';

export interface TaskSettings {
  enabled: boolean;
  url: string;
  collections: string[];
  ignoredProcess?: string[];
  taskRetrievalTimer?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ArlasTaskService implements TaskService {
  private readonly http = inject(HttpClient);
  private options: GetOptions = {};
  private readonly getOptions = inject(GET_OPTIONS);

  private readonly taskUrls = new Map<string, string>();
  public ignoredProcess = new Set<AvailableProcess>();
  public taskRetrievalTimer = 5000;

  public constructor() {
    this.setOptions(this.getOptions());
  }

  public setOptions(options: GetOptions): void {
    this.options = options;
  }

  public setSettings(settings: TaskSettings) {
    if (!settings.enabled) {
      return;
    }

    // Check if the user is allowed to fetch the jobs
    this.http.get(settings.url + '/jobs', this.options)
      .subscribe({
        next: () => {
          settings.collections.forEach(collection => {
            this.taskUrls.set(collection, settings.url);
          });

          this.ignoredProcess = new Set<AvailableProcess>();
          settings.ignoredProcess?.forEach(p => this.ignoredProcess.add(p as AvailableProcess));
          this.taskRetrievalTimer = settings.taskRetrievalTimer ?? 5000;
        }
      });
  }

  public getTasks(collection: string, identifier: string): Observable<Task[]> {
    const taskUrl = this.taskUrls.get(collection);
    if (!taskUrl) {
      return of([]);
    }

    return this.http.get(taskUrl + '/jobs/resources/' + identifier, this.options) as Observable<Task[]>;
  }
}
