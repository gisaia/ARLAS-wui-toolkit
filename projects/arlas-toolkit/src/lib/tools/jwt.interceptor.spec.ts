import { TestBed } from '@angular/core/testing';
import { DateTimeProvider, OAuthLogger, OAuthService, UrlHelperService } from 'angular-oauth2-oidc';
import { JwtInterceptor } from './jwt.interceptor';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AuthentificationService } from '../services/authentification/authentification.service';

describe('JwtInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [],
    providers: [
        AuthentificationService,
        OAuthService,
        OAuthLogger,
        DateTimeProvider,
        UrlHelperService,
        JwtInterceptor,
        provideHttpClient(withInterceptorsFromDi())
    ]
}));

  it('should be created', () => {
    const interceptor: JwtInterceptor = TestBed.inject(JwtInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
