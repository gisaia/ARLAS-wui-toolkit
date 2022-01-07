import { TestBed } from '@angular/core/testing';

import {
  ArlasStartupService, ArlasConfigService, ArlasCollaborativesearchService,
  CONFIG_UPDATER,
  FETCH_OPTIONS
} from './startup.service';
import { HttpClientModule } from '@angular/common/http';
import {
  TranslateModule, TranslateService, TranslateLoader,
  TranslateFakeLoader, TranslateStore
} from '@ngx-translate/core';
import { ArlasConfigurationUpdaterService } from '../configuration-updater/configurationUpdater.service';
import { ArlasSettingsService } from '../settings/arlas.settings.service';

describe('ArlasStartupService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
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
        TranslateService, TranslateStore,
        { provide: CONFIG_UPDATER, useValue: {} },
        { provide: FETCH_OPTIONS, useValue: {} },
      ],
      imports: [
        HttpClientModule,
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateFakeLoader } })
      ]
    });
  });

  it('should be created', (() => {
    const service: ArlasStartupService = TestBed.get(ArlasStartupService);
    expect(service).toBeTruthy();
  }));
});
