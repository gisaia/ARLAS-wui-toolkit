/*
 * Licensed to Gisaïa under one or more contributor
 * license agreements. See the NOTICE.txt file distributed with
 * this work for additional information regarding copyright
 * ownership. Gisaïa licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ArlasMessage, LoginData, PermissionData, PermissionDef, UserData } from 'arlas-iam-api';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs/internal/Subject';
import { from } from 'rxjs/internal/observable/from';
import { timer } from 'rxjs/internal/observable/timer';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { AuthentSetting, NOT_CONFIGURED } from '../../tools/utils';
import { ArlasAuthentificationService } from '../arlas-authentification/arlas-authentification.service';
import { ArlasIamApi } from '../startup/startup.service';
import { ArlasSettingsService } from '../settings/arlas.settings.service';
import { finalize, tap } from 'rxjs';

export const ARLAS_ORG_FILTER = 'arlas-org-filter';


export interface IamHeader {
  Authorization: string;
  [ARLAS_ORG_FILTER]: string;
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
  private currentOrganisation = '';

  public tokenRefreshed$ = this.tokenRefreshedSource.asObservable();
  public user: UserData;
  public reloadState: string;
  public storage = new Map();

  public constructor(
    private router: Router,
    private settings: ArlasSettingsService
  ) {
    super();
  }

  public declareReloadState(reloadState) {
    this.reloadState = reloadState;
  }

  public consumeReloadState() {
    if (this.reloadState) {
      window.open(this.reloadState, '_self');
    }
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
      headers[ARLAS_ORG_FILTER] = organisation;
    }
    this.setOptions({ headers });
  }

  /** Stores the given org and access token in localstorage + set iamService headers. */
  public setHeaders(org: string, accessToken: string): void {
    this.storeAccessToken(accessToken);
    this.storeOrganisation(org);
    const headers = {
      Authorization: 'Bearer ' + accessToken,
      [ARLAS_ORG_FILTER]: org
    };
    this.setOptions({ headers });
  }

  public storeAccessToken(accessToken: string): void {
    this.storage.set('accessToken', accessToken);
  }

  public getAccessToken(): string {
    return this.storage.get('accessToken');
  }

  /** Gets organisation from localstorage.
   * The method checks if the organisation is defined
   * If not returned the first of the list in user's organisations.
   */
  public getOrganisation(): string {
    if (!!this.currentOrganisation) {
      return this.currentOrganisation;
    } else {
      if (!!this.user && this.user.organisations?.length > 0) {
        return this.user.organisations[0].name;
      }
      return null;
    }
  }

  public storeOrganisation(organisation: string): void {
    this.currentOrganisation = organisation;
  }

  public notifyTokenRefresh(loginData: LoginData) {
    this.tokenRefreshedSource.next(loginData);
  }

  private clearTokens() {
    this.storage.delete('accessToken');
  }

  private clearOrganisation() {
    this.currentOrganisation = null;
  }

  /** This method should be called right after being logged in
   * THUS; there is no need to refresh the token at 0; we can wait for the moment the token is about to expire to **start** the timer.
   * By doing this we avoid refreshing the token twice in a row.
   * Also starting the refresh at 0 causes some incoherence in localstorage when we activate 'redirect_uri' parameter in settings.yaml
   */
  public startRefreshTokenTimer(loginData: LoginData): void {
    this.tokenRefreshedSource.next(loginData);
    // permit to obtain accessToken expiration date
    const accessToken = loginData.access_token;
    const jwtToken = JSON.parse(atob(accessToken.split('.')[1]));
    const exp = jwtToken.exp;
    const iat = jwtToken.iat;
    const threshold = (exp-iat)/2;
    const expires = new Date(exp * 1000);
    // set a timeout to refresh the accessToken at de half life of the accessToken
    const timeout = expires.getTime() - Date.now() - (threshold * 1000);
    // refresh accessToken when timeout ended (passing the refreshToken)
    // start the timer at 'timeout' which is the duration where the token is about to expire
    // repeat each 'timeout'
    this.refreshTokenTimer$ = timer(timeout, timeout).pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.refresh().subscribe({
        next: (loginData: LoginData) => {
          // store localy accessToken
          this.user = loginData.user;
          this.setHeadersFromAccesstoken(loginData.access_token);
          this.tokenRefreshedSource.next(loginData);
        },
        error: (e) => {
          this.logout();
        }
      });
    });
  }

  public initAuthService() {
    return this.refresh().toPromise()
      .then(
        (loginData: LoginData) => {
          this.user = loginData.user;
          this.setHeadersFromAccesstoken(loginData.access_token);
          this.startRefreshTokenTimer(loginData);
          return Promise.resolve();
        })
      .catch((err) => {
        this.checkForceConnect();
        console.error(err);
        return Promise.resolve();
      });
  }


  private checkForceConnect() {
    const authSettings = this.settings.getAuthentSettings();
    if (!!authSettings && authSettings.force_connect && this.needsRedirection(window.location.pathname)) {
      this.forceConnect(authSettings);
    }
  }

  private needsRedirection(path: string): boolean {
    return !path.includes('/verify') && !path.includes('/reset') && !path.includes('/register') && !path.includes('/password_forgot');
  }

  private forceConnect(authSettings: AuthentSetting) {
    if (authSettings.login_url && authSettings.login_url !== NOT_CONFIGURED) {
      window.open(authSettings.login_url, '_self');
    } else {
      this.router.navigate(['login']);
    }
  }

  public isAuthenticated(){
    return !!this.user;
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

  public logoutWithoutRedirection$() {
    return from(this.arlasIamApi.logout(this.options)).pipe(
      tap(() => {
        this.user = undefined;
        this.clearStore();
        this.stopRefreshTokenTimer();
        this.notifyTokenRefresh(null);
        localStorage.setItem('arlas-logout-event', 'logout' + Date.now());
      })
    );

  }

  public logout(redirectPageAfterLogout: string[] = ['/login']): void {
    this.logoutWithoutRedirection$().pipe(
      finalize(() => this.router.navigate(redirectPageAfterLogout).then(() => {
        window.location.reload();
      }))
    ).subscribe(() => this.user = undefined);
  }

  public refresh(): Observable<LoginData> {
    // No need access token to refresh so we remove the access token in header if present
    let options = this.options;
    if (!!options && options.headers && options.headers.Authorization) {
      delete options.headers.Authorization;
    }
    if (!options) {
      options = { credentials: 'include' };
    } else {
      options.credentials = 'include';
    }
    return from(this.arlasIamApi.refresh(options));
  }

  public login(email: string, password: string) {
    let options = this.options;
    if (!!options && options.headers && options.headers.Authorization) {
      delete options.headers.Authorization;
    }
    if (!options) {
      options = { credentials: 'include' };
    } else {
      options.credentials = 'include';
    }
    return from(this.arlasIamApi.login({ email, password }, options));
  }

  public signUp(email: string): Observable<UserData> {
    return from(this.arlasIamApi.createUser({ email }, this.options));
  }

  public verify(userId: string, token: string, password: string): Observable<UserData> {
    return from(this.arlasIamApi.verifyUser(password, userId, token, this.options));
  }

  public reset(userId: string, token: string, password: string): Observable<UserData> {
    return from(this.arlasIamApi.resetUserPassword(password, userId, token, this.options));
  }

  public forgot(email: string): Observable<ArlasMessage> {
    return from(this.arlasIamApi.askPasswordReset(email, this.options));
  }

  public change(oldPassword: string, newPassword: string): Observable<UserData> {
    return from(this.arlasIamApi.updateUser({ oldPassword: oldPassword, newPassword: newPassword }, this.user.id, this.options));
  }

  public createPermission(oid: string, permissionDef: PermissionDef): Observable<PermissionData> {
    return from(this.arlasIamApi.addPermission(permissionDef, oid, this.options));
  }

}
