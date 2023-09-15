import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginData, RefreshToken, UserData } from 'arlas-iam-api';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { from } from 'rxjs/internal/observable/from';
import { of } from 'rxjs/internal/observable/of';
import { timer } from 'rxjs/internal/observable/timer';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Subject } from 'rxjs/internal/Subject';
import { AuthentSetting, NOT_CONFIGURED } from '../../tools/utils';
import { ArlasIamApi } from '../startup/startup.service';
import { ArlasAuthentificationService } from '../arlas-authentification/arlas-authentification.service';

@Injectable({
  providedIn: 'root'
})
export class ArlasIamService extends ArlasAuthentificationService {

  private options;
  public currentUserSubject: BehaviorSubject<{ accessToken: string; refreshToken: RefreshToken; user: UserData; }>;
  public arlasIamApi: ArlasIamApi;
  private executionObservable;
  private unsubscribe: Subject<void> = new Subject<void>();

  public constructor(
    private router: Router
  ) {
    super();
    this.currentUserSubject = new BehaviorSubject<{ accessToken: string; refreshToken: RefreshToken; user: UserData; }>(null);
  }

  public setOptions(options): void {
    this.options = options;
  }

  public setArlasIamApi(api: ArlasIamApi) {
    this.arlasIamApi = api;
  }

  public startRefreshTokenTimer(authentSetting: AuthentSetting): void {
    // parse json object from base64 encoded jwt token
    if (!!localStorage.getItem('refreshToken')) {
      const refresh: RefreshToken = JSON.parse(localStorage.getItem('refreshToken'));
      // permit to obtain accessToken expiration date
      const expires = new Date(refresh.expiry_date * 1000);
      // set a timeout to refresh the accessToken one minute before it expires
      const timeout = expires.getTime() - Date.now() - (60 * 1000);
      // refresh accessToken when timeout ended (passing the refreshToken)
      // accessToken expires in 15 minutes (900s), refreshToken expires in 15 days
      this.executionObservable = timer(10000, timeout).pipe(takeUntil(this.unsubscribe)).subscribe(() => {
        this.refresh(refresh.value)
          .pipe(mergeMap((response) => {
            // store localy accessToken
            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('refreshToken', JSON.stringify(response.refreshToken));
            return of(response);
          })).subscribe(
            response => {
              this.currentUserSubject.next({ accessToken: response.accessToken, refreshToken: response.refreshToken, user: response.user });
            });
      });
    }

  }

  public initAuthService() {
    let refreshToken: RefreshToken = {};
    try {
      refreshToken = JSON.parse(localStorage.getItem('refreshToken'));
    } catch (error) {
      refreshToken = null;
    }
    if (!!refreshToken) {
      this.setOptions({
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('accessToken')
        }
      });
      return this.refresh(refreshToken.value).toPromise()
        .then(
          response => {
            const accessToken = response.accessToken;
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', JSON.stringify(response.refreshToken));
            this.setOptions({
              headers: {
                Authorization: 'Bearer ' + accessToken
              }
            });
            this.currentUserSubject.next(
              { accessToken: accessToken, refreshToken: response.refreshToken, user: response.user }
            );
            this.startRefreshTokenTimer(this.authConfigValue);
            return Promise.resolve();
          }).catch((err) => console.log(err));
    } else {
      return Promise.resolve();
    }
  }

  public areSettingsValid(authentSetting: AuthentSetting): [boolean, string] {
    let valid = true;
    const missingInfo = [];
    if (authentSetting && authentSetting.use_authent) {
      if (!authentSetting.url || authentSetting.url === NOT_CONFIGURED) {
        valid = false;
        missingInfo.push('- `iam server url` must be configured when `auth_mode=iam`');
      }
      if (!authentSetting.threshold) {
        valid = false;
        missingInfo.push('- `iam server threshold` must be configured when `auth_mode=iam`');
      }

    }
    return [valid, missingInfo.join('\n')];
  }

  public stopRefreshTokenTimer(): void {
    this.unsubscribe.next();
    if (this.executionObservable) {
      this.executionObservable.unsubscribe();
    }
  }

  public logout(redirectPageAfterLogout: string[] = ['/login']): void {
    // remove accessToken from local storage and stop associated timer
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.stopRefreshTokenTimer();
    // set currentUser to null and redirect to login page
    this.currentUserSubject.next(null);
    this.router.navigate(redirectPageAfterLogout);
  }

  public refresh(refreshToken): Observable<LoginData> {
    return from(this.arlasIamApi.refresh(refreshToken, this.options));
  }

  public get currentUserValue(): { accessToken: string; refreshToken: RefreshToken; user: UserData; } {
    return this.currentUserSubject.value;
  }

  public login(email: string, password: string) {
    return from(this.arlasIamApi.login({ email, password }, this.options));
  }

  public signUp(email: string): Observable<UserData> {
    return from(this.arlasIamApi.createUser({ email }, this.options));
  }

  public verify(userId: string, token: string, password: string): Observable<UserData> {
    return from(this.arlasIamApi.verifyUser(userId, token, password, this.options));
  }

  public reset(userId: string, token: string, password: string): Observable<UserData> {
    return from(this.arlasIamApi.resetUserPassword(userId, token, password, this.options));
  }

  public forgot(email: string): Observable<string> {
    return from(this.arlasIamApi.askPasswordReset(email, this.options));
  }

}
