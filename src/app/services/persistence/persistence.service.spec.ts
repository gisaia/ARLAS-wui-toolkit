import { TestBed, inject } from '@angular/core/testing';

import { PersistenceService } from './persistence.service';
import { ArlasConfigService } from 'arlas-wui-toolkit';
import { HttpClientModule } from '@angular/common/http';
import { AuthentificationService } from 'arlas-wui-toolkit/services/authentification/authentification.service';
import { OAuthService, OAuthModule, OAuthLogger, UrlHelperService } from 'angular-oauth2-oidc';


describe('PersistenceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, OAuthModule],
      providers: [ArlasConfigService,
        OAuthService,
        OAuthLogger,
        UrlHelperService,
        AuthentificationService
      ]
    });
  });

  it('should be created', inject([ArlasConfigService],
    (arlasConfigService: ArlasConfigService) => {
      const service: PersistenceService = TestBed.get(PersistenceService);
      expect(service).toBeTruthy();
      expect(arlasConfigService).toBeTruthy();

    }));
});
