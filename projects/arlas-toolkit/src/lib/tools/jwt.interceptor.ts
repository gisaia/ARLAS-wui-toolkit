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

import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PROTECTED_IMAGE_HEADER } from 'arlas-web-components';
import { Observable } from 'rxjs';
import { ArlasIamService } from '../services/arlas-iam/arlas-iam.service';
import { AuthentificationService } from '../services/authentification/authentification.service';
import { ArlasSettingsService } from '../services/settings/arlas.settings.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  public constructor(
    private authenticationService: AuthentificationService,
    private iamService: ArlasIamService,
    private settingsService: ArlasSettingsService
  ) { }

  public intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Intercepts quicklook requests to add token
    if (!request.headers.has(PROTECTED_IMAGE_HEADER) || request.headers.get(PROTECTED_IMAGE_HEADER) !== 'true') {
      return next.handle(request);
    }
    request = request.clone({
      headers: request.headers.delete(PROTECTED_IMAGE_HEADER)
    });

    const authSettings = this.settingsService.getAuthentSettings();
    let authentMode = !!authSettings ? authSettings.auth_mode : undefined;
    if (!!authSettings && !!authSettings.use_authent && !authentMode) {
      authentMode = 'openid';
    }

    // add authorization header with accessToken to Http request if logged
    if (authentMode === 'openid') {
      const hasValidAccessToken = this.authenticationService.hasValidAccessToken();
      if (hasValidAccessToken) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${this.authenticationService.accessToken}`,
          }
        });
      }
    } else if (authentMode === 'iam') {
      const token = this.iamService.getAccessToken();
      if (!!token) {
        let headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
        const org = this.iamService.getOrganisation();
        if (org !== null && org !== undefined) {
          headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'arlas-org-filter': org
          });
        }
        request = request.clone({headers});
      }
    }
    return next.handle(request);
  }
}
