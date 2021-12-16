import { Injectable } from '@angular/core';
import fetchIntercept from 'fetch-intercept';
import { MatDialog } from '@angular/material/dialog';
import { ReconnectDialogComponent } from '../../components/reconnect-dialog/reconnect-dialog.component';
import { ArlasSettingsService } from '../settings/arlas.settings.service';
import { InvalidConfigDialogComponent } from '../../components/invalid-config-dialog/invalid-config-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class FetchInterceptorService {

  constructor(private arlasSettings: ArlasSettingsService, private dialog: MatDialog) {

  }

  public applyInterceptor() {
    const settings = this.arlasSettings.settings;
    const useAuthent = !!settings && !!settings.authentication && !!settings.authentication.use_authent;
    if (useAuthent) {
      const unregister = fetchIntercept.register({
        request: (url, config) => {
          // Modify the url or config here
          return [url, config];
        },
        requestError: (error) => {
          return Promise.reject(error);
        },
        response: (response) => {
          // Modify the reponse object
          let code = response.status;
          if (code === 401 || code === 403) {
            // Check if the response comes from a call to a non arlas public uri
            if (!!response.headers.get('WWW-Authenticate')) {
              code = 403;
            }
            // Propose to reconnect or stay disconnected
            // Open just one modal
            if (!this.dialog.openDialogs || !this.dialog.openDialogs.length) {
              this.dialog.open(ReconnectDialogComponent, { disableClose: true, data: { code } });
            }
          }
          return response;
        },
        responseError: (error) => {
          // Handle an fetch error
          return Promise.reject(error);
        }
      });
    }
  }

  public interceptInvalidConfig(configId: string) {
    this.dialog.open(InvalidConfigDialogComponent, { disableClose: true, data: { configId } });
  }
}
