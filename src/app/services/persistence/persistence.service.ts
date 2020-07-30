import { Injectable, InjectionToken, Inject } from '@angular/core';
import * as portableFetch from 'portable-fetch';

import { Observable } from 'rxjs/internal/Observable';
import { from } from 'rxjs/internal/observable/from';
import { Configuration, PersistApi, DataResource, DataWithLinks } from 'arlas-persistence-api';
import { EnvService } from '../env/env.service';

export const GET_OPTIONS = new InjectionToken<Function>('get_options');

@Injectable({
  providedIn: 'root'
})
export class PersistenceService {

  private persistenceApi: PersistApi;
  constructor(
    @Inject(GET_OPTIONS) private getOptions,
    private envService: EnvService
  ) {
    const configuraiton = new Configuration();
    const baseUrl = this.envService.persistenceUrl;
    this.persistenceApi = new PersistApi(configuraiton, baseUrl, portableFetch);
  }


  public delete(id: string): Observable<DataWithLinks> {
    return from(this.persistenceApi.deleteById(id, false, this.getOptions()));
  }

  public create(zone: string, name: string, value: string, readers?: string[], writers?: string[]): Observable<DataWithLinks> {
    return from(this.persistenceApi.create(zone, name, value, readers, writers, false, this.getOptions()));

  }
  public get(id: string): Observable<DataWithLinks> {
    return from(this.persistenceApi.getById(id, false, this.getOptions()));
  }
  public list(zone: string, size: number, page: number, order: string): Observable<DataResource> {
    return from(this.persistenceApi.list(zone, size, page, order, false, this.getOptions()));

  }
  public update(id: string, value: string, lastUpdate: number, name?: string,
    readers?: string[], writers?: string[]): Observable<DataWithLinks> {
      return from(this.persistenceApi.update(id, value, lastUpdate, name, readers, writers, false, this.getOptions()));
  }

}
