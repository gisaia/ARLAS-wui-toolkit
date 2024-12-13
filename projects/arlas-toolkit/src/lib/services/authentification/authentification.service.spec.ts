import { TestBed } from '@angular/core/testing';
import {
  OAuthModule, OAuthService, UrlHelperService
} from 'angular-oauth2-oidc';

import { AuthentificationService } from './authentification.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('AuthentificationService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [OAuthModule.forRoot()],
      providers: [OAuthService, UrlHelperService, provideHttpClient(withInterceptorsFromDi())]
    }));
  it('should be created', () => {
    const service: AuthentificationService = TestBed.get(AuthentificationService);
    expect(service).toBeTruthy();
  });
});
