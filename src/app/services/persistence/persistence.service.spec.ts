import { TestBed, inject } from '@angular/core/testing';

import { PersistenceService, GET_OPTIONS } from './persistence.service';
import { HttpClientModule } from '@angular/common/http';
import { OAuthService, OAuthModule, OAuthLogger, UrlHelperService } from 'angular-oauth2-oidc';
import { ArlasConfigService } from '../startup/startup.service';
import { AuthentificationService } from '../authentification/authentification.service';
import { getOptionsFactory } from './../../app.module';


describe('PersistenceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, OAuthModule],
      providers: [ArlasConfigService,
        OAuthService,
        OAuthLogger,
        UrlHelperService,
        AuthentificationService,
        { provide: GET_OPTIONS, useValue: {} },
        {
          provide: GET_OPTIONS,
          useFactory: getOptionsFactory,
          deps: [AuthentificationService]
        }
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
