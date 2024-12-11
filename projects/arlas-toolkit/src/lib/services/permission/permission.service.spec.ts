import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { DateTimeProvider, OAuthLogger, OAuthModule, OAuthService, UrlHelperService } from 'angular-oauth2-oidc';
import { AuthentificationService } from '../authentification/authentification.service';
import { GET_OPTIONS } from '../../tools/utils';
import { ArlasSettingsService } from '../settings/arlas.settings.service';
import { PermissionService } from './permission.service';
import { getOptionsFactory } from '../../toolkit.module';

describe('PermissionService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [OAuthModule],
    providers: [
        ArlasSettingsService,
        OAuthService,
        DateTimeProvider,
        OAuthLogger,
        UrlHelperService,
        AuthentificationService,
        {
            provide: GET_OPTIONS,
            useFactory: getOptionsFactory,
            deps: [AuthentificationService]
        },
        provideHttpClient(withInterceptorsFromDi())
    ]
}));

  it('should be created', () => {
    const service: PermissionService = TestBed.get(PermissionService);
    expect(service).toBeTruthy();
  });
});
