import { TestBed } from '@angular/core/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { ArlasCollaborativesearchService } from '../collaborative-search/arlas.collaborative-search.service';
import { ArlasCollectionService } from '../collection/arlas-collection.service';
import { ArlasConfigurationUpdaterService } from '../configuration-updater/configurationUpdater.service';
import { ArlasStartupService, FETCH_OPTIONS } from '../startup/startup.service';
import { ArlasExportCsvService } from './export-csv.service';

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
        ArlasCollectionService
      ]
    }));
  it('should be created', () => {
    const service: ArlasExportCsvService = TestBed.get(ArlasExportCsvService);
    expect(service).toBeTruthy();
  });
});
