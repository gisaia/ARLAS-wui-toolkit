import { TestBed } from '@angular/core/testing';

import { ArlasExportCsvService } from './export-csv.service';
import { ArlasStartupService, ArlasCollaborativesearchService } from '../startup/startup.service';
import { TranslateModule, TranslateLoader, TranslateFakeLoader, TranslateService } from '@ngx-translate/core';

describe('ArlasExportCsvService', () => {
  beforeEach(() =>
  TestBed.configureTestingModule({
    imports: [
      TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateFakeLoader } })
    ],
    providers: [ArlasStartupService, ArlasCollaborativesearchService, TranslateService]
  }));
  it('should be created', () => {
    const service: ArlasExportCsvService = TestBed.get(ArlasExportCsvService);
    expect(service).toBeTruthy();
  });
});
