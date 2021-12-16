import { Injectable } from '@angular/core';
import { OAuthService, AuthConfig, OAuthErrorEvent, OAuthStorage, UserInfo } from 'angular-oauth2-oidc';
import { BehaviorSubject, ReplaySubject, Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { HttpClient } from '@angular/common/http';
import { CONFIG_ID_QUERY_PARAM } from '../../tools/utils';
import { filter } from 'rxjs/internal/operators/filter';
import { from } from 'rxjs/internal/observable/from';

export const NOT_CONFIGURED = 'NOT_CONFIGURED';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

  public authConfig: AuthConfig;
  public authConfigValue: AuthentSetting;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();
  private isDoneLoadingSubject = new ReplaySubject<boolean>();
  public isDoneLoading = this.isDoneLoadingSubject.asObservable();

  public silentRefreshErrorSubject;
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
  constructor(private oauthService: OAuthService, private http: HttpClient
  ) {
    this.silentRefreshErrorSubject = this.oauthService.events.pipe(filter(e => e instanceof OAuthErrorEvent),
      filter((e: OAuthErrorEvent) => e.type === 'silent_refresh_error' || e.type === 'silent_refresh_timeout'));
  }

  public initAuthService(authentSettings: AuthentSetting): Promise<void> {
    this.authConfigValue = authentSettings;
    if (this.authConfigValue) {
      const storage = this.authConfigValue['storage'] === 'localstorage' ? localStorage : sessionStorage;
      if (authentSettings.use_discovery || this.authConfigValue['jwks_endpoint'] === undefined) {
        this.authConfig = this.getAuthConfig(this.authConfigValue);
        this.setupAuthService(storage);
        return this.runInitialLoginSequence(authentSettings.use_discovery, authentSettings.force_connect);
      } else {
        // Call jwks endpoint to set in config
        if (this.authConfigValue['token_endpoint'] && this.authConfigValue['userinfo_endpoint']
          && this.authConfigValue['login_url'] && this.authConfigValue['jwks_endpoint']) {
          return this.http.get(this.authConfigValue['jwks_endpoint']).toPromise()
            .then(jwks => {
              this.authConfig = this.getAuthConfig(this.authConfigValue, jwks);
              this.setupAuthService(storage);
              this.runInitialLoginSequence(false, authentSettings.force_connect);
            });
        } else {
          console.error('Authentication config error : if useDiscovery ' +
            'is set to false in configuration, tokenEndpoint, userinfoEndpoint, loginUrl and jwksEndpoint must be defined.');
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
        if (this.oauthService.hasValidAccessToken() && this.oauthService.hasValidIdToken()) {
          return Promise.resolve();
        }
        return this.oauthService.silentRefresh()
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
  public logout() { this.oauthService.logOut(); }
  public refresh() { this.oauthService.silentRefresh(); }
  public hasValidAccessToken() { return this.oauthService.hasValidAccessToken(); }
  public hasValidIdToken() { return this.oauthService.hasValidIdToken(); }
  public get accessToken() { return this.oauthService.getAccessToken(); }
  public get identityClaims() { return this.oauthService.getIdentityClaims(); }
  public get idToken() { return this.oauthService.getIdToken(); }
  public get logoutUrl() { return this.oauthService.logoutUrl; }

  public areSettingsValid(authentSetting: AuthentSetting): [boolean, string] {
    let valid = true;
    const missingInfo = [];
    if (authentSetting && authentSetting.use_authent) {
      if (!authentSetting.client_id || authentSetting.client_id === NOT_CONFIGURED) {
        valid = false;
        missingInfo.push('- `client_id` is not configured');
      }
      if (!authentSetting.issuer || authentSetting.issuer === NOT_CONFIGURED) {
        valid = false;
        missingInfo.push('- `issuer` is not configured');
      }
      if (!authentSetting.scope || authentSetting.scope === NOT_CONFIGURED) {
        valid = false;
        missingInfo.push('- `scope` is not configured');
      }
      if (!authentSetting.response_type || authentSetting.response_type === NOT_CONFIGURED) {
        valid = false;
        missingInfo.push('- `response_type` is not configured');
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

    this.oauthService.events
      .subscribe(_ => {
        this.isAuthenticatedSubject.next(this.oauthService.hasValidAccessToken() && this.oauthService.hasValidIdToken());
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
      if (authConfigValue['dummy_client_secret'] !== undefined && authConfigValue['dummy_client_secret'] !== NOT_CONFIGURED) {
        authServiceConfig.dummyClientSecret = authConfigValue['dummy_client_secret'];
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
    // include the config_id query parameter in the redirectUrl
    const configId = (new URL(window.location.href)).searchParams.get(CONFIG_ID_QUERY_PARAM);
    if (configId) {
      authServiceConfig.redirectUri = authServiceConfig.redirectUri + '?' + CONFIG_ID_QUERY_PARAM + '=' + configId;
    }
    return authServiceConfig;
  }
}


export interface AuthentSetting {
  use_discovery: boolean;
  force_connect: boolean;
  use_authent: boolean;
  client_id: string;
  issuer: string;
  scope?: string;
  response_type?: string;
  redirect_uri?: string;
  silent_refresh_redirect_uri?: string;
  silent_refresh_timeout?: number;
  timeout_factor?: number;
  session_checks_enabled?: boolean;
  show_debug_information?: boolean;
  clear_hash_after_login?: boolean;
  disable_at_hash_check?: boolean;
  require_https?: boolean;
  dummy_client_secret?: string;
  userinfo_endpoint?: string;
  token_endpoint?: string;
  jwks_endpoint?: string;
  login_url?: string;
  logout_url?: string;
  storage?: string;
}
