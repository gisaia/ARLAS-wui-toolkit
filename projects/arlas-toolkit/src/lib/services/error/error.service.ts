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
import { marker } from '@colsen1991/ngx-translate-extract-marker';
import { Subscription } from 'rxjs';
import { DeniedAccessDialogComponent } from '../../components/denied-access-dialog/denied-access-dialog.component';
import { ArlasSettingsService } from '../../services/settings/arlas.settings.service';
import { AuthorisationError } from '../../tools/errors/authorisation-error';
import { BackendError } from '../../tools/errors/backend-error';
import { SettingsError } from '../../tools/errors/settings-error';
import { ArlasCollaborativesearchService } from '../collaborative-search/arlas.collaborative-search.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  private arlasErrorsSubscription: Subscription;

  public constructor(
    private readonly dialog: MatDialog,
    private readonly settingsService: ArlasSettingsService,
    private readonly arlasCollaborationService: ArlasCollaborativesearchService,
    private readonly snackBar: MatSnackBar,
    private readonly translate: TranslateService
  ) { }

  public emitAuthorisationError(error: AuthorisationError, forceAction = true) {
    if (!this.dialog.openDialogs || this.dialog.openDialogs.length === 0) {
      this.dialog.open(DeniedAccessDialogComponent, {
        disableClose: true, data: {
          error,
          forceAction
        },
        panelClass: 'arlas-error-dialog'
      });
    }
  }

  public emitUnavailableService(service: string) {
    if (!this.dialog.openDialogs || this.dialog.openDialogs.length === 0) {
      this.dialog.open(DeniedAccessDialogComponent, {
        disableClose: true, data: {
          error: new BackendError(502, '', this.settingsService.getArlasHubUrl(),  service),
          forceAction: true
        },
        panelClass: 'arlas-error-dialog'
      });
    }
  }

  public emitSettingsError() {
    if (!this.dialog.openDialogs || this.dialog.openDialogs.length === 0) {
      this.dialog.open(DeniedAccessDialogComponent, {
        disableClose: true, data: {
          error: new SettingsError(),
          forceAction: true
        },
        panelClass: 'arlas-error-dialog'
      });
    }
  }

  public emitBackendError(status: number, message: string, service: string, mode: 'snackbar' | 'dialog' = 'dialog') {
    if (mode === 'dialog') {
      if (!this.dialog.openDialogs || this.dialog.openDialogs.length === 0) {
        this.dialog.open(DeniedAccessDialogComponent, {
          disableClose: true, data: {
            error: new BackendError(status, message, this.settingsService.getArlasHubUrl(), service),
            forceAction: true
          },
          panelClass: 'arlas-error-dialog'
        });
      }
    } else if (mode === 'snackbar') {
      this.snackBar.open(message, this.translate.instant('Close'), { panelClass: 'arlas-error-snackbar' });
    }
  }

  public closeAll() {
    this.dialog.closeAll();
    return this.dialog;
  }

  public listenToArlasCollaborativeErrors() {
    this.arlasErrorsSubscription = this.arlasCollaborationService.collaborationErrorBus.subscribe((e: any) => {
      if (e.status >= 400) {
        this.emitBackendError(e.status, e.message, marker('ARLAS-server'));
      } else if (!e.status) {
        // In case ARLAS-server got down during the use of the app
        this.emitUnavailableService(marker('ARLAS-server'));
      }
    });
  }

  public unlistenToArlasCollaborativeErrors() {
    this.arlasErrorsSubscription.unsubscribe();
  }
}
