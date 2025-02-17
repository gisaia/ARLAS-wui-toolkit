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

import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { marker } from '@colsen1991/ngx-translate-extract-marker';
import fetchIntercept from 'fetch-intercept';
import { DeniedAccessDialogComponent } from '../../components/denied-access-dialog/denied-access-dialog.component';
import { ReconnectDialogComponent } from '../../components/reconnect-dialog/reconnect-dialog.component';
import { ErrorService } from '../../services/error/error.service';
import { AuthorisationError } from '../../tools/errors/authorisation-error';
import { DeniedAccessData } from '../../tools/utils';
import { ArlasSettingsService } from '../settings/arlas.settings.service';

@Injectable({
  providedIn: 'root'
})
export class FetchInterceptorService {

  public constructor(
    private readonly arlasSettings: ArlasSettingsService,
    private readonly dialog: MatDialog,
    private readonly errorService: ErrorService,
    private readonly router: Router) { }

  public interceptLogout() {
    const settings = this.arlasSettings.settings;
    if (settings.authentication.auth_mode === 'iam') {
      this.router.navigate(['login']);
    } else {
      this.errorService.emitAuthorisationError(new AuthorisationError(401));
    }
  }

  public applyInterceptor() {
    const settings = this.arlasSettings.settings;
    const useAuthent = !!settings && !!settings.authentication && !!settings.authentication.use_authent;
    if (useAuthent) {
      fetchIntercept.register({
        request: (url, config) =>
          // Modify the url or config here
          [url, config]
        ,
        requestError: (error) => Promise.reject(error),
        response: (response) => {
          // Modify the reponse object
          let code = response.status;
          if (code === 401 || code === 403) {
            // Check if the response comes from a call to a non arlas public uri
            if (response.headers.has('WWW-Authenticate')) {
              code = 403;
            }
            if (settings.authentication.auth_mode === 'iam') {
              // If not currently logging in, display error
              if (this.router.url !== '/login') {
                this.errorService.emitAuthorisationError(new AuthorisationError(code));
              }
            } else if (this.dialog.openDialogs?.length === undefined || this.dialog.openDialogs?.length === 0) {
              // Propose to reconnect or stay disconnected
              this.dialog.open(
                ReconnectDialogComponent,
                {
                  disableClose: true,
                  data: { code },
                  backdropClass: 'reconnect-dialog',
                  panelClass: 'reconnect-dialog-panel'
                });
            }
          } else if (code >= 400) {
            let message: string = marker('An error occured.');

            if (code === 400) {
              message = marker('An error occured when requesting data.');
            } else if (code === 404) {
              message = marker('The requested data does not exist.');
            }
            this.errorService.emitBackendError(code, message, marker('ARLAS-server'));
          }
          return response;
        },
        // Handle a fetch error
        responseError: (error) =>  {
          console.log(error);
          return Promise.reject(error);
        }
      });
    }
  }

  public interceptInvalidConfig(dahsboardDeniedData: DeniedAccessData) {
    this.dialog.open(DeniedAccessDialogComponent, {
      disableClose: true, data: dahsboardDeniedData,
      panelClass: 'arlas-error-dialog'
    });
  }
}
