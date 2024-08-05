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
import { AuthorizeApi, Configuration, Resource } from 'arlas-permissions-api';
import { Observable } from 'rxjs/internal/Observable';
import { from } from 'rxjs/internal/observable/from';
import { GET_OPTIONS } from '../../tools/utils';
import { ArlasSettingsService } from '../settings/arlas.settings.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  private authorizeApi: AuthorizeApi;
  private options;

  public constructor(
    @Inject(GET_OPTIONS) private getOptions,
    private settingsService: ArlasSettingsService
  ) {
    this.setOptions(this.getOptions());
    this.createPermissionApiInstance();
  }

  public setOptions(options): void {
    this.options = options;
  }

  public createPermissionApiInstance(): void {
    const permissionSettings = this.settingsService.getPermissionSettings();
    if (!this.authorizeApi && !!permissionSettings) {
      const configuration = new Configuration();
      this.authorizeApi = new AuthorizeApi(configuration, permissionSettings.url, window.fetch);
    }

  }

  public get(filter: string): Observable<Resource[]> {
    return from(this.authorizeApi.get(filter, false, this.options));
  }
}

export interface PermissionSetting {
  url: string;
}
