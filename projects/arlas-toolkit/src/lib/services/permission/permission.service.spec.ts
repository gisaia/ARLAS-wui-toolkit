import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { OAuthLogger, OAuthModule, OAuthService, UrlHelperService } from 'angular-oauth2-oidc';
import { AuthentificationService } from '../authentification/authentification.service';
import { GET_OPTIONS } from '../persistence/persistence.service';
import { ArlasSettingsService } from '../settings/arlas.settings.service';
import { PermissionService } from './permission.service';
import { getOptionsFactory } from '../../toolkit.module';

describe('PermissionService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientModule, OAuthModule],
    providers: [
      ArlasSettingsService,
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
  }));

  it('should be created', () => {
    const service: PermissionService = TestBed.get(PermissionService);
    expect(service).toBeTruthy();
  });
});
