import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TestBed, inject } from '@angular/core/testing';
import { DateTimeProvider, OAuthLogger, OAuthModule, OAuthService, UrlHelperService } from 'angular-oauth2-oidc';
import { GET_OPTIONS } from '../../tools/utils';
import { AuthentificationService } from '../authentification/authentification.service';
import { ArlasSettingsService } from '../settings/arlas.settings.service';
import { PersistenceService } from './persistence.service';
import { MockArlasSettingsService } from '../../tools/tests/arlas-settings-service.mock';


describe('PersistenceService', () => {
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

  it('should be created', inject([ArlasSettingsService],
    (arlasSettingsSerivce: ArlasSettingsService) => {
      const service: PersistenceService = TestBed.get(PersistenceService);
      expect(service).toBeTruthy();
      expect(arlasSettingsSerivce).toBeTruthy();
    }));
});
