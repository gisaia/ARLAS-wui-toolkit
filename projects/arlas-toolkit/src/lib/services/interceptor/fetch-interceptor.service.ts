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
                this.dialog.open(ReconnectDialogComponent, { disableClose: true, data: { code } });
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
