import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { map } from 'rxjs/internal/operators/map';
import { ArlasIamService } from './arlas-iam.service';
import { RefreshToken } from 'arlas-iam-api';
import { ArlasSettingsService } from '../settings/arlas.settings.service';
import { catchError } from 'rxjs/operators';

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
      return this.arlasIamService.refresh(refreshToken.value).pipe(map(data => {
        if (!!data) {
          // tslint:disable-next-line:no-string-literal
          const accessToken = (data as any).accessToken;
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', JSON.stringify((data as any).refreshToken));
          this.arlasIamService.setOptions({
            headers: {
              Authorization: 'Bearer ' + accessToken
            }
          });
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
