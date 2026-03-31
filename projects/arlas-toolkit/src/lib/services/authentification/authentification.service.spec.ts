import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { OAuthModule, OAuthService, UrlHelperService } from 'angular-oauth2-oidc';
import { beforeEach, describe, expect, it } from 'vitest';
import { AuthentificationService } from './authentification.service';

describe('AuthentificationService', () => {
  let service: AuthentificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OAuthModule.forRoot()],
      providers: [OAuthService, UrlHelperService, provideHttpClient(withInterceptorsFromDi())]
    });

    service = TestBed.inject(AuthentificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
