import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { map } from 'rxjs/internal/operators/map';
import { catchError, mergeMap } from 'rxjs/operators';
import { ArlasSettingsService } from '../settings/arlas.settings.service';
import { ArlasIamService } from './arlas-iam.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardIamService {

  public constructor(
    private router: Router,
    private arlasIamService: ArlasIamService,
  ) { }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    if (!!this.arlasIamService.user) {
      // If arlasIamService has a user no need to try to refresh
      // Usefull to not call refresh too many times in app navigation
      return of(true);
    } else {
      return this.arlasIamService.refresh().pipe(map(loginData => {
        if (!!loginData) {
          this.arlasIamService.setHeadersFromAccesstoken(loginData.access_token);
          return true;
        } else {
          return false;
        }
      }),
      catchError(() => this.arlasIamService.logoutWithoutRedirection$().pipe(mergeMap(() => {
        this.router.navigate(['/login']);
        return of(false);
      }))));
    }
  }
}
