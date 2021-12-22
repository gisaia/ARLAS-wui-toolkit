import { TestBed } from '@angular/core/testing';

import { ArlasExportCsvService } from './export-csv.service';
import { TranslateModule, TranslateLoader, TranslateFakeLoader, TranslateService } from '@ngx-translate/core';
import { ArlasStartupService, ArlasCollaborativesearchService, FETCH_OPTIONS } from '../startup/startup.service';
import { ArlasConfigurationUpdaterService } from '../configuration-updater/configurationUpdater.service';

describe('ArlasExportCsvService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateFakeLoader } })
      ],
      providers: [
        TranslateService,
        {
          provide: ArlasStartupService,
          useClass: ArlasStartupService,
          deps: [ArlasConfigurationUpdaterService]
        },
        ArlasCollaborativesearchService,
        {
          provide: ArlasConfigurationUpdaterService,
          useClass: ArlasConfigurationUpdaterService
        },
        { provide: FETCH_OPTIONS, useValue: {} },
      ]
    }));
  it('should be created', () => {
    const service: ArlasExportCsvService = TestBed.get(ArlasExportCsvService);
    expect(service).toBeTruthy();
  });
});
