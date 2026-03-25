import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import {
  TranslateLoader, TranslateModule, TranslateNoOpLoader
} from '@ngx-translate/core';
import { ArlasCollaborativesearchService } from '../collaborative-search/arlas.collaborative-search.service';
import { ArlasConfigurationUpdaterService } from '../configuration-updater/configurationUpdater.service';
import { ArlasSettingsService } from '../settings/arlas.settings.service';
import { ArlasConfigService, ArlasStartupService, CONFIG_UPDATER, FETCH_OPTIONS } from './startup.service';

describe('ArlasStartupService', () => {
  let service: ArlasStartupService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateNoOpLoader } })
      ],
      providers: [
        {
          provide: ArlasStartupService,
          useClass: ArlasStartupService,
          deps: [ArlasConfigurationUpdaterService]
        },
        {
          provide: ArlasConfigurationUpdaterService,
          useClass: ArlasConfigurationUpdaterService
        },
        ArlasConfigService,
        ArlasCollaborativesearchService,
        ArlasSettingsService,
        { provide: CONFIG_UPDATER, useValue: {} },
        { provide: FETCH_OPTIONS, useValue: {} },
        provideHttpClient(withInterceptorsFromDi()),
      ]
    });

    service = TestBed.inject(ArlasStartupService);
  });

  it('should be created', (() => {
    expect(service).toBeTruthy();
  }));
});
