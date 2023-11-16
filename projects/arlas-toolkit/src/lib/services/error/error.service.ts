import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Error } from '../startup/startup.service';
import { MatDialog } from '@angular/material/dialog';
import { DeniedAccessDialogComponent } from '../../components/denied-access-dialog/denied-access-dialog.component';
import { AuthorisationError } from '../../tools/errors/authorisation-error';
import { BackendError } from '../../tools/errors/backend-error';
import { ArlasSettingsService } from '../../services/settings/arlas.settings.service';
import { SettingsError } from '../../tools/errors/settings-error';
@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  public constructor(
    private dialog: MatDialog,
    private settingsService: ArlasSettingsService) {

  }

  public emitAuthorisationError(error: AuthorisationError) {
    if (!this.dialog.openDialogs || this.dialog.openDialogs.length === 0) {
      this.dialog.open(DeniedAccessDialogComponent, {
        disableClose: true, data: {
          error,
          forceAction: true
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
}
