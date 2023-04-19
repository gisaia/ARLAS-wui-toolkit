import { TestBed } from '@angular/core/testing';
import {
  OAuthModule, OAuthService, UrlHelperService
} from 'angular-oauth2-oidc';

import { AuthentificationService } from './authentification.service';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';

describe('AuthentificationService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [OAuthService, HttpClient, UrlHelperService],
      imports: [OAuthModule.forRoot(), HttpClientModule]
    }));
  it('should be created', () => {
    const service: AuthentificationService = TestBed.get(AuthentificationService);
    expect(service).toBeTruthy();
  });
});
