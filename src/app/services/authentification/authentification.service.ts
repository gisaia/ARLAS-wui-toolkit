import { Inject, Injectable, Injector } from '@angular/core';
import { OAuthService, JwksValidationHandler, AuthConfig, OAuthErrorEvent } from 'angular-oauth2-oidc';
import { BehaviorSubject, ReplaySubject, Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { filter } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ArlasConfigService } from '../startup/startup.service';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

  public authConfig: AuthConfig;
  public authConfigValue: any;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();
  private isDoneLoadingSubject = new ReplaySubject<boolean>();
  public isDoneLoading = this.isDoneLoadingSubject.asObservable();
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

  }

  public initAuthService(configService, useDiscovery?: boolean, forceConnect?: boolean): Promise<void> {
    this.authConfigValue = configService.getValue('arlas.authentification');
    if (this.authConfigValue) {
      if (useDiscovery || this.authConfigValue['jwksEndpoint'] === undefined) {
        this.authConfig = this.getAuthConfig(this.authConfigValue);
        this.setupAuthService();
        return this.runInitialLoginSequence(useDiscovery, forceConnect);
      }
    } else {
      // Call jwks endpoint to set in config
      if (this.authConfigValue['tokenEndpoint'] && this.authConfigValue['userinfoEndpoint']
        && this.authConfigValue['loginUrl'] && this.authConfigValue['jwksEndpoint']) {
        return this.http.get(this.authConfigValue['jwksEndpoint']).toPromise()
          .then(jwks => {
            this.authConfig = this.getAuthConfig(this.authConfigValue, jwks);
            this.setupAuthService();
            this.runInitialLoginSequence(false, forceConnect);
          });
      } else {
        console.error('Authentification config error : if useDiscovery ' +
          'is set to false in configuration,  tokenEndpoint,userinfoEndpoint,loginUrl and jwksEndpoint must be defined.');
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

  private setupAuthService() {
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
        this.isAuthenticatedSubject.next(this.oauthService.hasValidAccessToken());
      });
    this.oauthService.setupAutomaticSilentRefresh();
  }


  private getAuthConfig(authConfigValue, jwks?): AuthConfig {
    let authServiceConfig: AuthConfig;
    let url = window.location.origin.concat(window.location.pathname);
    if (url.slice(-1) !== '/') {
      url = url.concat('/');
    }
    if (authConfigValue) {
      if (authConfigValue['useDiscovery']) {
        authServiceConfig = {
          clientId: authConfigValue['clientId'],
          issuer: authConfigValue['issuer'],
          scope: authConfigValue['scope'],
          responseType: authConfigValue['responseType'],
          redirectUri: authConfigValue['redirectUri'] !== undefined ? authConfigValue['redirectUri'] : url + 'callback',
          silentRefreshRedirectUri: authConfigValue['silentRefreshRedirectUri'] !== undefined ?
            authConfigValue['silentRefreshRedirectUri'] : url + 'silent-refresh.html',
          timeoutFactor: authConfigValue['timeoutFactor'] !== undefined ? authConfigValue['timeoutFactor'] : 0.75,
          sessionChecksEnabled: authConfigValue['sessionChecksEnabled'] !== undefined ? authConfigValue['sessionChecksEnabled'] : true,
          showDebugInformation: authConfigValue['showDebugInformation'] !== undefined ? authConfigValue['showDebugInformation'] : false,
          silentRefreshTimeout: authConfigValue['silentRefreshTimeout'] !== undefined ? authConfigValue['silentRefreshTimeout'] : 5000,
          clearHashAfterLogin: authConfigValue['clearHashAfterLogin'] !== undefined ? authConfigValue['clearHashAfterLogin'] : false,
          disableAtHashCheck: authConfigValue['disableAtHashCheck'] !== undefined ? authConfigValue['disableAtHashCheck'] : false,
          requireHttps: authConfigValue['requireHttps'] !== undefined ? authConfigValue['requireHttps'] : true
        };
        if (authConfigValue['dummyClientSecret'] !== undefined) {
          authServiceConfig['dummyClientSecret'] = authConfigValue['dummyClientSecret'];
        }
      } else {
        authServiceConfig = {
          clientId: authConfigValue['clientId'],
          issuer: authConfigValue['issuer'],
          scope: authConfigValue['scope'],
          responseType: authConfigValue['responseType'],
          tokenEndpoint: authConfigValue['tokenEndpoint'],
          userinfoEndpoint: authConfigValue['userinfoEndpoint'],
          loginUrl: authConfigValue['loginUrl'],
          redirectUri: authConfigValue['redirectUri'] !== undefined ? authConfigValue['redirectUri'] : url + 'callback',
          silentRefreshRedirectUri: authConfigValue['silentRefreshRedirectUri'] !== undefined ?
            authConfigValue['silentRefreshRedirectUri'] : url + 'silent-refresh.html',
          timeoutFactor: authConfigValue['timeoutFactor'] !== undefined ? authConfigValue['timeoutFactor'] : 0.75,
          sessionChecksEnabled: authConfigValue['sessionChecksEnabled'] !== undefined ? authConfigValue['sessionChecksEnabled'] : true,
          showDebugInformation: authConfigValue['showDebugInformation'] !== undefined ? authConfigValue['showDebugInformation'] : false,
          silentRefreshTimeout: authConfigValue['silentRefreshTimeout'] !== undefined ? authConfigValue['silentRefreshTimeout'] : 5000,
          clearHashAfterLogin: authConfigValue['clearHashAfterLogin'] !== undefined ? authConfigValue['clearHashAfterLogin'] : false,
          disableAtHashCheck: authConfigValue['disableAtHashCheck'] !== undefined ? authConfigValue['disableAtHashCheck'] : false,
          requireHttps: authConfigValue['requireHttps'] !== undefined ? authConfigValue['requireHttps'] : true
        };
        if (jwks !== undefined) {
          authServiceConfig['jwks'] = jwks;
        }
        if (authConfigValue['dummyClientSecret'] !== undefined) {
          authServiceConfig['dummyClientSecret'] = authConfigValue['dummyClientSecret'];
        }
      }
    }
    return authServiceConfig;
  }
}
