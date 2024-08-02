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
import fetchIntercept from 'fetch-intercept';
import { ReconnectDialogComponent } from '../../components/reconnect-dialog/reconnect-dialog.component';
import { ArlasSettingsService } from '../settings/arlas.settings.service';
import { DeniedAccessDialogComponent } from '../../components/denied-access-dialog/denied-access-dialog.component';
import { DeniedAccessData } from '../../tools/utils';
import { AuthorisationError } from '../../tools/errors/authorisation-error';
import { ErrorService } from '../../services/error/error.service';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class FetchInterceptorService {

  public constructor(
    private arlasSettings: ArlasSettingsService,
    private dialog: MatDialog,
    private errorService: ErrorService) {

  }

  public interceptLogout() {
    this.errorService.emitAuthorisationError(new AuthorisationError(401));
  }

  public applyInterceptor() {
    const settings = this.arlasSettings.settings;
    const useAuthent = !!settings && !!settings.authentication && !!settings.authentication.use_authent;
    if (useAuthent) {
      const unregister = fetchIntercept.register({
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
            if (!!response.headers.get('WWW-Authenticate')) {
              code = 403;
            }
            if (settings.authentication.auth_mode === 'iam') {
              this.errorService.emitAuthorisationError(new AuthorisationError(code));

            } else {
              // Propose to reconnect or stay disconnected
              if (!this.dialog.openDialogs || !this.dialog.openDialogs.length) {
                this.dialog.open(
                  ReconnectDialogComponent,
                  {
                    disableClose: true,
                    data: { code },
                    backdropClass: 'reconnect-dialog',
                    panelClass: 'reconnect-dialog-panel'
                  });
              }
            }
          }
          return response;
        },
        responseError: (error) =>
        // Handle a fetch error
        // eslint-disable-next-line brace-style
        {
          console.log(error);
          return Promise.reject(error);
        }

      });
    }
  }

  public interceptInvalidConfig(dahsboardDeniedData: DeniedAccessData) {
    this.dialog.open(DeniedAccessDialogComponent, { disableClose: true, data: dahsboardDeniedData });
  }
}
