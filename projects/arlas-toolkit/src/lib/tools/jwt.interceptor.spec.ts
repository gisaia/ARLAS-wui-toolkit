import { TestBed } from '@angular/core/testing';
import { OAuthModule } from 'angular-oauth2-oidc';
import { beforeEach, describe, expect, it } from 'vitest';
import { JwtInterceptor } from './jwt.interceptor';

describe('JwtInterceptor', () => {
  let interceptor: JwtInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        OAuthModule.forRoot()
      ],
      providers: [
        JwtInterceptor
      ]
    });

    interceptor = TestBed.inject(JwtInterceptor);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });
});
