import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { DateTimeProvider, OAuthLogger, OAuthModule, OAuthService, UrlHelperService } from 'angular-oauth2-oidc';
import { GET_OPTIONS } from '../../tools/utils';
import { AuthentificationService } from '../authentification/authentification.service';
import { ArlasSettingsService } from '../settings/arlas.settings.service';
import { PermissionService } from './permission.service';
import { MockArlasSettingsService } from '../../tools/tests/arlas-settings-service.mock';

describe('PermissionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OAuthModule],
      providers: [
        {
          provide: ArlasSettingsService,
          useClass: MockArlasSettingsService
        },
        OAuthService,
        DateTimeProvider,
        OAuthLogger,
        UrlHelperService,
        AuthentificationService,
        {
          provide: GET_OPTIONS,
          useValue: () => {}
        },
        provideHttpClient(withInterceptorsFromDi())
      ]
    });
  });

  it('should be created', () => {
    const service: PermissionService = TestBed.get(PermissionService);
    expect(service).toBeTruthy();
  });
});
