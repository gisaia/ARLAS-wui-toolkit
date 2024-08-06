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
import { DeniedAccessDialogComponent } from '../../components/denied-access-dialog/denied-access-dialog.component';
import { ArlasSettingsService } from '../../services/settings/arlas.settings.service';
import { AuthorisationError } from '../../tools/errors/authorisation-error';
import { BackendError } from '../../tools/errors/backend-error';
import { SettingsError } from '../../tools/errors/settings-error';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  public constructor(
    private dialog: MatDialog,
    private settingsService: ArlasSettingsService) {

  }

  public emitAuthorisationError(error: AuthorisationError, forceAction = true) {
    if (!this.dialog.openDialogs || this.dialog.openDialogs.length === 0) {
      this.dialog.open(DeniedAccessDialogComponent, {
        disableClose: true, data: {
          error,
          forceAction
        }
      });
    }
  }

  public emitUnavailableService(service: string) {
    if (!this.dialog.openDialogs || this.dialog.openDialogs.length === 0) {
      this.dialog.open(DeniedAccessDialogComponent, {
        disableClose: true, data: {
          error: new BackendError(502, '', this.settingsService.getArlasHubUrl(),  service),
          forceAction: true
        }
      });
    }
  }

  public emitSettingsError() {
    if (!this.dialog.openDialogs || this.dialog.openDialogs.length === 0) {
      this.dialog.open(DeniedAccessDialogComponent, {
        disableClose: true, data: {
          error: new SettingsError(),
          forceAction: true
        }
      });
    }
  }

  public emitBackendError(status: number, message: string, service: string) {
    if (!this.dialog.openDialogs || this.dialog.openDialogs.length === 0) {
      this.dialog.open(DeniedAccessDialogComponent, {
        disableClose: true, data: {
          error: new BackendError(status, message, this.settingsService.getArlasHubUrl(), service),
          forceAction: true
        }
      });
    }
  }

  public closeAll() {
    this.dialog.closeAll();
    return this.dialog;
  }
}
