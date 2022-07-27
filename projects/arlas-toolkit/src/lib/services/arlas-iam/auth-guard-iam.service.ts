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
    const refreshToken: RefreshToken = JSON.parse(localStorage.getItem('refreshToken'));

    if (!!refreshToken) {
      this.arlasIamService.setOptions({
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('accessToken')
        }
      });
      return this.arlasIamService.refresh(refreshToken.value).pipe(map(session => {
        if (!!session) {
          const accessToken = session.accessToken;
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', JSON.stringify(session.refreshToken));
          this.arlasIamService.setOptions({
            headers: {
              Authorization: 'Bearer ' + accessToken
            }
          });

          this.arlasIamService.currentUserSubject.next({ accessToken: accessToken, refreshToken: session.refreshToken, userId: session.user.id });
          this.arlasIamService.startRefreshTokenTimer(this.settingsService.settings.authentication);
          return true;
        } else {
          return false;
        }
      }), catchError(() => {
        this.router.navigate(['/login']);
        this.arlasIamService.currentUserSubject.next(null);
        return of(false);
      }));
    } else {
      this.router.navigate(['/login']);
      this.arlasIamService.currentUserSubject.next(null);
      return of(false);
    }
  }


}
