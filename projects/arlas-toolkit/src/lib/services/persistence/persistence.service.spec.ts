import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { DateTimeProvider, OAuthLogger, OAuthModule, OAuthService, UrlHelperService } from 'angular-oauth2-oidc';
import { beforeEach, describe, expect, it } from 'vitest';
import { MockArlasSettingsService } from '../../tools/tests/arlas-settings-service.mock';
import { GET_OPTIONS } from '../../tools/utils';
import { AuthentificationService } from '../authentification/authentification.service';
import { ArlasSettingsService } from '../settings/arlas.settings.service';
import { PersistenceService } from './persistence.service';


describe('PersistenceService', () => {
  let service: PersistenceService;

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

    service = TestBed.inject(PersistenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
