import { Injectable } from '@angular/core';
import fetchIntercept from 'fetch-intercept';
import { MatDialog } from '@angular/material/dialog';
import { ReconnectDialogComponent } from '../../components/reconnect-dialog/reconnect-dialog.component';
import { ArlasSettingsService } from '../settings/arlas.settings.service';

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
          if (response.status === 401 || response.status === 403) {
            // Propose to reconnect or stay disconnected
            this.dialog.open(ReconnectDialogComponent, { disableClose: true, data: { code: response.status } });
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
}
