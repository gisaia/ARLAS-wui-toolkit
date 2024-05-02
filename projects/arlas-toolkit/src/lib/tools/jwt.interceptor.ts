import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PROTECTED_IMAGE_HEADER } from 'arlas-web-components';
import { AuthentificationService } from '../services/authentification/authentification.service';
import { ARLAS_ORG_FILTER, ArlasIamService } from '../services/arlas-iam/arlas-iam.service';
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
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
        const org = this.iamService.getOrganisation();
        console.log(org);
        if (org !== null && org !== undefined) {
          headers.append(ARLAS_ORG_FILTER, org);
          console.log('inside', headers[ARLAS_ORG_FILTER]);
        }
        console.log('outside', headers[ARLAS_ORG_FILTER]);

        request = request.clone({headers});
      }
    }
    return next.handle(request);
  }
}
