import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { RefreshToken } from 'arlas-iam-api';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { map } from 'rxjs/internal/operators/map';
import { catchError } from 'rxjs/operators';
import { ArlasSettingsService } from '../settings/arlas.settings.service';
import { ArlasIamService } from './arlas-iam.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardIamService {

  public constructor(
    private router: Router,
    private arlasIamService: ArlasIamService,
    private settingsService: ArlasSettingsService
  ) { }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const refreshToken: RefreshToken = this.arlasIamService.getRefreshToken();
    if (!!refreshToken) {
      const accessToken = this.arlasIamService.getAccessToken();
      this.arlasIamService.setHeadersFromAccesstoken(accessToken);
      return this.arlasIamService.refresh(refreshToken.value).pipe(map(loginData => {
        if (!!loginData) {
          this.arlasIamService.setHeadersFromAccesstoken(loginData.access_token);
          this.arlasIamService.storeRefreshToken(loginData.refresh_token);
          return true;
        } else {
          return false;
        }
      }), catchError(() => {
        this.arlasIamService.logoutWithoutRedirection();
        this.router.navigate(['/login']);
        return of(false);
      }));
    } else {
      this.arlasIamService.logoutWithoutRedirection();
      this.router.navigate(['/login']);
      return of(true);
    }
  }


}
