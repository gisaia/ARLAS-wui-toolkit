import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ArlasIamService } from '../services/arlas-iam/arlas-iam.service';
import { ArlasSettings } from '../services/startup/startup.service';



export const interceptorSkip = 'X-Skip-Interceptor';

@Injectable()
export class IamInterceptor implements HttpInterceptor {
  public constructor(
    private iamService: ArlasIamService,
    private settings: ArlasSettings
  ) { }

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip intercept
    if (request.headers && request.headers.has(interceptorSkip)) {
      const headers = request.headers.delete(interceptorSkip);
      return next.handle(request.clone({ headers }));
    }

    const currentUser = this.iamService?.currentUserValue;
    const isLoggedIn = !!currentUser && !!currentUser.accessToken;
    const isApiUrl = !!this.settings.authentication && request.url.startsWith(this.settings.authentication.url);
    const askRefresh = request.url.endsWith('auth/token');

    // add authorization header with accessToken to API Http request
    if (isLoggedIn && isApiUrl && !askRefresh) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${currentUser.accessToken}` }
      });
    }

    return next.handle(request).pipe(catchError(err => {
      // auto logout if 401 or 403 response returned from API
      if ([401, 403].includes(err.status)) {
        this.iamService.logout();
      }
      if ([404].includes(err.status) && askRefresh) {
        this.iamService.logout();
      }
      console.error(err);
      const error = (err && err.error && err.error.detail) || err.statusText;
      return throwError(error);
    }));
  }
}
