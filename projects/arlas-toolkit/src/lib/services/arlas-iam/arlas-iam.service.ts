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


export interface IamHeader {
  Authorization: string;
  'arlas-org-filter': string;
}
@Injectable({
  providedIn: 'root'
})
export class ArlasIamService extends ArlasAuthentificationService {

  private options;
  private arlasIamApi: ArlasIamApi;
  private refreshTokenTimer$;
  private unsubscribe: Subject<void> = new Subject<void>();
  private tokenRefreshedSource: BehaviorSubject<LoginData> = new BehaviorSubject(null);
  public tokenRefreshed$ = this.tokenRefreshedSource.asObservable();
  public user: UserData;

  public constructor(
    private router: Router
  ) {
    super();
  }

  public setOptions(options): void {
    this.options = options;
  }

  public setArlasIamApi(api: ArlasIamApi) {
    this.arlasIamApi = api;
  }

  /**
   * - Strores the given access token in localstorage
   * - Set the headers of iamService with an already stored organisation in localstorage.  */
  public setHeadersFromAccesstoken(accessToken: string): void {
    this.storeAccessToken(accessToken);
    const headers = {
      Authorization: 'Bearer ' + accessToken
    };
    const organisation = this.getOrganisation();
    if (organisation) {
      headers['arlas-org-filter'] = organisation;
    }
    this.setOptions({ headers });
  }

  /** Stores the given org and access token in localstorage + set iamService headers. */
  public setHeaders(org: string, accessToken: string): void {
    this.storeAccessToken(accessToken);
    this.storeOrganisation(org);
    const headers = {
      Authorization: 'Bearer ' + accessToken,
      'arlas-org-filter': org
    };
    this.setOptions({ headers });
  }

  public storeAccessToken(accessToken: string): void {
    localStorage.setItem('accessToken', accessToken);
  }

  public getAccessToken(): string {
    return localStorage.getItem('accessToken');
  }

  public storeRefreshToken(refreshToken: RefreshToken): void {
    localStorage.setItem('refreshToken', JSON.stringify(refreshToken));
  }

  public getRefreshToken(): RefreshToken {
    const stringifiedRefreshToken = localStorage.getItem('refreshToken');
    if (!!stringifiedRefreshToken) {
      // parse json object from base64 encoded jwt token
      return JSON.parse(stringifiedRefreshToken);
    }
    return undefined;
  }

  /** Gets organisation from localstorage.
   * The method checks if the organisation in lc is within the user's organisations.
   * If not the organisation is removed from lc.
   */
  public getOrganisation(): string {
    const storedOrganisation = localStorage.getItem('arlas-org-filter');
    if (this.user && this.user.organisations && !!storedOrganisation) {
      if ((new Set(this.user.organisations.map(o => o.name))).has(storedOrganisation)) {
        return storedOrganisation;
      } else {
        /** cleans organisation from lc that is not part of the user's organisations */
        this.clearOrganisation();
        return;
      }
    }
    return undefined;
  }

  public storeOrganisation(organisation: string): void {
    localStorage.setItem('arlas-org-filter', organisation);
  }

  public notifyTokenRefresh(loginData: LoginData) {
    this.tokenRefreshedSource.next(loginData);
  }

  private clearTokens() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  private clearOrganisation() {
    localStorage.removeItem('arlas-org-filter');
  }

  public startRefreshTokenTimer(loginData: LoginData): void {
    const refreshToken = loginData.refreshToken;
    if (!!refreshToken) {
      // permit to obtain accessToken expiration date
      const accessToken = loginData.accessToken;
      const jwtToken = JSON.parse(atob(accessToken.split('.')[1]));
      const expires = new Date(jwtToken.exp * 1000);
      // set a timeout to refresh the accessToken one minute before it expires
      const timeout = expires.getTime() - Date.now() - (60 * 1000);
      // todo: !! attention if the token expires in less than one minute !
      // refresh accessToken when timeout ended (passing the refreshToken)
      this.refreshTokenTimer$ = timer(0, timeout).pipe(takeUntil(this.unsubscribe)).subscribe(() => {
        const newestRefreshToken = this.getRefreshToken();
        this.refresh(newestRefreshToken.value).subscribe({
          next: (loginData: LoginData) => {
            // store localy accessToken
            this.user = loginData.user;
            this.setHeadersFromAccesstoken(loginData.accessToken);
            this.storeRefreshToken(loginData.refreshToken);
            this.tokenRefreshedSource.next(loginData);
          },
          error: (e) => {
            this.logout();
          }
        });
      });
    }

  }

  public initAuthService() {
    const refreshToken: RefreshToken = this.getRefreshToken();
    if (!!refreshToken) {
      const accessToken = this.getAccessToken();
      this.setHeadersFromAccesstoken(accessToken);
      return this.refresh(refreshToken.value).toPromise()
        .then(
          (loginData: LoginData) => {
            this.user = loginData.user;
            this.setHeadersFromAccesstoken(loginData.accessToken);
            this.storeRefreshToken(loginData.refreshToken);
            this.tokenRefreshedSource.next(loginData);
            this.startRefreshTokenTimer(loginData);
            return Promise.resolve();
          }).catch((err) => {
          console.log(err);
          return Promise.resolve();
        });
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
    if (this.refreshTokenTimer$) {
      this.refreshTokenTimer$.unsubscribe();
    }
  }

  public clearStore() {
    this.clearTokens();
    this.clearOrganisation();
  }

  public logoutWithoutRedirection() {
    this.user = undefined;
    this.clearStore();
    this.stopRefreshTokenTimer();
    this.notifyTokenRefresh(null);
  }

  public logout(redirectPageAfterLogout: string[] = ['/login']): void {
    this.logoutWithoutRedirection();
    this.router.navigate(redirectPageAfterLogout);
  }

  public refresh(refreshToken): Observable<LoginData> {
    return from(this.arlasIamApi.refresh(refreshToken, this.options));
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
