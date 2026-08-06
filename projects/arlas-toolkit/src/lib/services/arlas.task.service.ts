import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Task, TaskService } from 'arlas-web-contributors';
import { Observable, of } from 'rxjs';
import { GET_OPTIONS, GetOptions } from '../tools/utils';

@Injectable({
  providedIn: 'root',
})
export class ArlasTaskService implements TaskService {
  private readonly http = inject(HttpClient);
  private options: GetOptions = {};
  private readonly getOptions = inject(GET_OPTIONS);

  private readonly taskUrls = new Map<string, string>();

  public constructor() {
    this.setOptions(this.getOptions());
  }

  public setOptions(options: GetOptions): void {
    this.options = options;
  }

  public setTaskUrl(url: string, collection: string) {
    this.taskUrls.set(collection, url);
  }

  public getTasks(collection: string, identifier: string): Observable<Task[]> {
    const taskUrl = this.taskUrls.get(collection);
    if (!taskUrl) {
      return of([]);
    }

    return this.http.get(taskUrl + '/jobs/resources/' + identifier, this.options) as Observable<Task[]>;
  }
}
