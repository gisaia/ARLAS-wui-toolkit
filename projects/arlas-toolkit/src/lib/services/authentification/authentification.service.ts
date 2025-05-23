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

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthConfig, OAuthErrorEvent, OAuthEvent, OAuthService, OAuthStorage, UserInfo } from 'angular-oauth2-oidc';
import { BehaviorSubject, Observable, ReplaySubject, combineLatest } from 'rxjs';
import { from } from 'rxjs/internal/observable/from';
import { filter } from 'rxjs/internal/operators/filter';
import { map } from 'rxjs/internal/operators/map';
import { AuthentSetting, CONFIG_ID_QUERY_PARAM, NOT_CONFIGURED } from '../../tools/utils';
import { ArlasAuthentificationService } from '../arlas-authentification/arlas-authentification.service';


export class CustomMemoryStorage implements OAuthStorage {
  private storage;
  private data = new Map<string, string>();
  public constructor(storage) {
    this.storage = storage;
  }
  private needsExternalStorage(key: string) {
    // Those three keys must be in external storage to stay logged at refresh with KC, but it's not sensible data
    return key === 'nonce' || key === 'PKCE_verifier' || key === 'refresh_token';
  }
  public getItem(key: string) {
    if (this.needsExternalStorage(key)) {
      return this.storage.getItem(key);
    }
    return this.data.get(key);
  }
  public removeItem(key: string) {
    if (this.needsExternalStorage(key)) {
      return this.storage.removeItem(key);
    }
    this.data.delete(key);
  }
  public setItem(key: string, data: string) {
    if (this.needsExternalStorage(key)) {
      return this.storage.setItem(key, data);
    }
    this.data.set(key, data);
  }
}


@Injectable({
  providedIn: 'root'
})
export class AuthentificationService extends ArlasAuthentificationService {

  public authConfig: AuthConfig;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();
  private isDoneLoadingSubject = new ReplaySubject<boolean>();
  public isDoneLoading = this.isDoneLoadingSubject.asObservable();

  public silentRefreshErrorSubject: Observable<OAuthEvent>;
  /**
   * Publishes `true` if and only if (a) all the asynchronous initial
   * login calls have completed or errorred, and (b) the user ended up
   * being authenticated.
   *
   * In essence, it combines:
   *
   * - the latest known state of whether the user is authorized
   * - whether the ajax calls for initial log in have all been done
   */
  public canActivateProtectedRoutes: Observable<boolean> = combineLatest(
    this.isAuthenticated,
    this.isDoneLoading
  ).pipe(map(values => values.every(b => b)));

  public constructor(
    private oauthService: OAuthService,
    private http: HttpClient
  ) {
    super();
    this.silentRefreshErrorSubject = this.oauthService.events.pipe(filter(e => e instanceof OAuthErrorEvent),
      filter((e: OAuthErrorEvent) => e.type === 'silent_refresh_error' || e.type === 'silent_refresh_timeout'));
  }

  public initAuthService(): Promise<void> {
    if (this.authConfigValue) {
      if (this.authConfigValue.use_authent) {
        const storage = this.authConfigValue['storage'] === 'localstorage' ? localStorage :
          this.authConfigValue['storage'] === 'sessionstorage' ? sessionStorage : new CustomMemoryStorage(sessionStorage);
        if (this.authConfigValue.use_discovery || this.authConfigValue['jwks_endpoint'] === undefined) {
          this.authConfig = this.getAuthConfig(this.authConfigValue);
          this.setupAuthService(storage);
          return this.runInitialLoginSequence(this.authConfigValue.use_discovery, this.authConfigValue.force_connect);
        } else {
          // Call jwks endpoint to set in config
          if (this.authConfigValue['token_endpoint'] && this.authConfigValue['userinfo_endpoint']
            && this.authConfigValue['login_url'] && this.authConfigValue['jwks_endpoint']) {
            return this.http.get(this.authConfigValue['jwks_endpoint']).toPromise()
              .then(jwks => {
                this.authConfig = this.getAuthConfig(this.authConfigValue, jwks);
                this.setupAuthService(storage);
                this.runInitialLoginSequence(false, this.authConfigValue.force_connect);
              });
          } else {
            console.error('Authentication config error : if useDiscovery ' +
              'is set to false in configuration, tokenEndpoint, userinfoEndpoint, loginUrl and jwksEndpoint must be defined.');
          }
        }
      }
    }
  }

  public runInitialLoginSequence(useDiscovery?: boolean, forceConnect?: boolean): Promise<void> {
    let startToLogin: Promise<any>;
    if (useDiscovery) {
      startToLogin = this.oauthService.loadDiscoveryDocument()
        .then(() => this.oauthService.tryLogin());
    } else {
      startToLogin = this.oauthService.tryLogin();
    }
    return startToLogin
      .then(() => {
        if (this.oauthService.hasValidAccessToken()) {
          return Promise.resolve();
        }
        return this.oauthService.refreshToken()
          .then(() => Promise.resolve())
          .catch(result => {
            if (forceConnect) {
              this.oauthService.initLoginFlow();
              console.warn('User interaction is needed to log in, we will wait for the user to manually log in.');
              return Promise.resolve();
            }
            return Promise.reject(result);
          });
      })
      .then(() => {
        this.isDoneLoadingSubject.next(true);
      })
      .catch(() => this.isDoneLoadingSubject.next(true));
  }


  public login() {
    this.oauthService.initLoginFlow();
  }
  public logout() {
    this.oauthService.logOut();
  }
  public refresh() {
    this.oauthService.refreshToken();
  }
  public hasValidAccessToken() {
    return this.oauthService.hasValidAccessToken();
  }
  public hasValidIdToken() {
    return this.oauthService.hasValidIdToken();
  }
  public get accessToken() {
    return this.oauthService.getAccessToken();
  }
  public get identityClaims() {
    return this.oauthService.getIdentityClaims();
  }
  public get idToken() {
    return this.oauthService.getIdToken();
  }
  public get logoutUrl() {
    return this.oauthService.logoutUrl;
  }

  public areSettingsValid(authentSetting: AuthentSetting): [boolean, string] {
    let valid = true;
    const missingInfo = [];
    if (authentSetting && authentSetting.use_authent) {

      if (!authentSetting.client_id || authentSetting.client_id === NOT_CONFIGURED) {
        valid = false;
        missingInfo.push('- `client_id` must be configured when `auth_mode=openid`');
      }
      if (!authentSetting.issuer || authentSetting.issuer === NOT_CONFIGURED) {
        valid = false;
        missingInfo.push('- `issuer` must be configured when `auth_mode=openid`');
      }
      if (!authentSetting.scope || authentSetting.scope === NOT_CONFIGURED) {
        valid = false;
        missingInfo.push('- `scope` must be configured when `auth_mode=openid`');
      }
      if (!authentSetting.response_type || authentSetting.response_type === NOT_CONFIGURED) {
        valid = false;
        missingInfo.push('- `response_type` must be configured when `auth_mode=openid`');
      }
      if (authentSetting.use_discovery === false) {
        if (!authentSetting.login_url || authentSetting.login_url === NOT_CONFIGURED) {
          valid = false;
          missingInfo.push('- `login_url`  must be configured when `use_discovery=false`');
        }
        if (!authentSetting.token_endpoint || authentSetting.token_endpoint === NOT_CONFIGURED) {
          valid = false;
          missingInfo.push('- `token_endpoint` must be configured when `use_discovery=false`');
        }
        if (!authentSetting.jwks_endpoint || authentSetting.jwks_endpoint === NOT_CONFIGURED) {
          valid = false;
          missingInfo.push('- `jwks_endpoint` must be configured when `use_discovery=false`');
        }
        if (!authentSetting.userinfo_endpoint || authentSetting.userinfo_endpoint === NOT_CONFIGURED) {
          valid = false;
          missingInfo.push('- `userinfo_endpoint` must be configured when `use_discovery=false`');
        }
      }

    }
    return [valid, missingInfo.join('\n')];
  }

  /**
   * Return an observable of the user Auth0 profile
   */
  public loadUserInfo(): Observable<UserInfo> {
    return from(<Promise<UserInfo>>this.oauthService.loadUserProfile());
  }

  private setupAuthService(storage: OAuthStorage) {
    this.oauthService.setStorage(storage);
    this.oauthService.configure(this.authConfig);
    // Useful for debugging:
    if (this.authConfig['showDebugInformation']) {
      this.oauthService.events.subscribe(event => {
        if (event instanceof OAuthErrorEvent) {
          console.error(event);
        } else {
          console.warn(event);
        }
      });
    }

    this.oauthService.events.pipe(filter(e => e.type !== 'session_unchanged'))
      .subscribe(e => {
        this.isAuthenticatedSubject.next(this.oauthService.hasValidAccessToken());
      });
    this.oauthService.setupAutomaticSilentRefresh();
  }


  private getAuthConfig(authConfigValue: AuthentSetting, jwks?): AuthConfig {
    let authServiceConfig: AuthConfig;
    let url = window.location.origin.concat(window.location.pathname);
    if (url.slice(-1) !== '/') {
      url = url.concat('/');
    }
    if (authConfigValue) {
      authServiceConfig = {
        clientId: authConfigValue['client_id'],
        issuer: authConfigValue['issuer'],
        scope: authConfigValue['scope'],
        responseType: authConfigValue['response_type'],
        redirectUri: (authConfigValue['redirect_uri'] !== undefined && authConfigValue['redirect_uri'] !== NOT_CONFIGURED) ?
          authConfigValue['redirect_uri'] : url + 'callback',
        silentRefreshRedirectUri: (authConfigValue['silent_refresh_redirect_uri'] !== undefined
          && authConfigValue['silent_refresh_redirect_uri'] !== NOT_CONFIGURED) ?
          authConfigValue['silent_refresh_redirect_uri'] : url + 'silent-refresh.html',
        timeoutFactor: authConfigValue['timeout_factor'] !== undefined ? authConfigValue['timeout_factor'] : 0.75,
        sessionChecksEnabled: authConfigValue['session_checks_enabled'] !== undefined ? authConfigValue['session_checks_enabled'] : true,
        showDebugInformation: authConfigValue['show_debug_information'] !== undefined ? authConfigValue['show_debug_information'] : false,
        silentRefreshTimeout: authConfigValue['silent_refresh_timeout'] !== undefined ? authConfigValue['silent_refresh_timeout'] : 5000,
        clearHashAfterLogin: authConfigValue['clear_hash_after_login'] !== undefined ? authConfigValue['clear_hash_after_login'] : false,
        disableAtHashCheck: authConfigValue['disable_at_hash_check'] !== undefined ? authConfigValue['disable_at_hash_check'] : false,
        requireHttps: authConfigValue['require_https'] !== undefined ? authConfigValue['require_https'] : true
      };
      if (authConfigValue['post_logout_redirect_uri'] !== undefined && authConfigValue['post_logout_redirect_uri'] !== NOT_CONFIGURED) {
        authServiceConfig.postLogoutRedirectUri = authConfigValue['post_logout_redirect_uri'];
      }
      if (authConfigValue['dummy_client_secret'] !== undefined && authConfigValue['dummy_client_secret'] !== NOT_CONFIGURED) {
        authServiceConfig.dummyClientSecret = authConfigValue['dummy_client_secret'];
      }
      if (authConfigValue['custom_query_params'] !== undefined && authConfigValue['custom_query_params'] !== NOT_CONFIGURED) {
        const customQueryParams = {};
        authConfigValue['custom_query_params'].forEach(obj => {
          for (const [key, value] of Object.entries(obj)) {
            customQueryParams[key] = value;
          }
        });
        authServiceConfig.customQueryParams = customQueryParams;
      }
      if (authConfigValue['logout_url'] !== undefined && authConfigValue['logout_url'] !== NOT_CONFIGURED) {
        authServiceConfig.logoutUrl = authConfigValue['logout_url'];
      }
      if (!authConfigValue['use_discovery']) {
        authServiceConfig.tokenEndpoint = authConfigValue['token_endpoint'];
        authServiceConfig.userinfoEndpoint = authConfigValue['userinfo_endpoint'];
        authServiceConfig.loginUrl = authConfigValue['login_url'];
        if (jwks !== undefined) {
          authServiceConfig['jwks'] = jwks;
        }
      }
    }
    // Apend arlas query parameters in the redirectUrl
    const queryParam =
      this.getQueryParam(CONFIG_ID_QUERY_PARAM) +
      this.getQueryParam('filter') +
      this.getQueryParam('extend') +
      this.getQueryParam('lg') +
      this.getQueryParam('rt') +
      this.getQueryParam('vs') +
      this.getQueryParam('at') +
      this.getQueryParam('ao') +
      this.getQueryParam('to') +
      this.getQueryParam('ro');
    if (queryParam !== '') {
      // remove last &
      authServiceConfig.redirectUri = authServiceConfig.redirectUri + '?' + encodeURI(queryParam.slice(0, -1));
    }
    return authServiceConfig;
  }
  private getQueryParam(param) {
    const value = (new URL(window.location.href)).searchParams.get(param);
    if (value) {
      return param.concat('=').concat(value).concat('&');
    } else {
      return '';
    }
  }
}
