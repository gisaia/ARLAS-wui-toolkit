import { TestBed, inject } from '@angular/core/testing';
import { PersistenceService } from './persistence.service';
import { GET_OPTIONS } from '../../tools/utils';
import { HttpClientModule } from '@angular/common/http';
import { OAuthService, OAuthModule, OAuthLogger, UrlHelperService, DateTimeProvider } from 'angular-oauth2-oidc';
import { AuthentificationService } from '../authentification/authentification.service';
import { getOptionsFactory } from '../../toolkit.module';
import { ArlasSettingsService } from '../settings/arlas.settings.service';


describe('PersistenceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, OAuthModule],
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
        }
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
