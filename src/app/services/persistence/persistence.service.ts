import { Injectable } from '@angular/core';


import * as portableFetch from 'portable-fetch';

import { Observable } from 'rxjs/internal/Observable';
import { from } from 'rxjs/internal/observable/from';
import { ArlasConfigService } from '../startup/startup.service';
import { AuthentificationService } from '../authentification/authentification.service';
import { Configuration, PersistenceApi, Data, DataResource } from 'arlas-persistence-api';

@Injectable({
  providedIn: 'root'
})
export class PersistenceService {

  private userPrefApi: PersistenceApi;
  constructor(private configService: ArlasConfigService,
    private arlasAuthService: AuthentificationService,
  ) {
    const configuraiton = new Configuration();
    const baseUrl = this.configService.getValue('arlas.persistence-server.url');
    this.userPrefApi = new PersistenceApi(configuraiton, baseUrl, portableFetch);
  }


  public delete(id: string): Observable<Data> {
    return from(this.userPrefApi._delete(id, false, this.getOptions()));
  }

  public create(type: string, value: string): Observable<Data> {
    return from(this.userPrefApi.create(type, value, false, this.getOptions()));

  }
  public get(id: string): Observable<Data> {
    return from(this.userPrefApi.get(id, false, this.getOptions()));

  }
  public list(type: string, size: number, page: number, order: string): Observable<DataResource> {
    return from(this.userPrefApi.list(type, size, page, order, false, this.getOptions()));

  }
  public update(id: string, value: string): Observable<Data> {
    return from(this.userPrefApi.update(id, value, false, this.getOptions()));

  }

  private getOptions(): any {
    // TODO remove this for prod it's just for test and dev in local
    const token = this.arlasAuthService.idToken !== null ? this.arlasAuthService.idToken : 'sebseb';
    // TODO change X-Forwarded-User to access_token when proxy will be ready
    return {
      headers: {
        'X-Forwarded-User': token
      }
    };
  }
}
