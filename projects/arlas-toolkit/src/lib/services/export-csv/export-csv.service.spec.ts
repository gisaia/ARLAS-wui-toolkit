import { TestBed } from '@angular/core/testing';
import { TranslateLoader, TranslateModule, TranslateNoOpLoader } from '@ngx-translate/core';
import { ArlasCollaborativesearchService } from '../collaborative-search/arlas.collaborative-search.service';
import { ArlasCollectionService } from '../collection/arlas-collection.service';
import { ArlasConfigurationUpdaterService } from '../configuration-updater/configurationUpdater.service';
import { ArlasStartupService, FETCH_OPTIONS } from '../startup/startup.service';
import { ArlasExportCsvService } from './export-csv.service';

describe('ArlasExportCsvService', () => {
  let service: ArlasExportCsvService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateNoOpLoader } })
      ],
      providers: [
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
    });

    service = TestBed.inject(ArlasExportCsvService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
