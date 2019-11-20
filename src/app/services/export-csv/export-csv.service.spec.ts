import { TestBed } from '@angular/core/testing';

import { ArlasExportCsvService } from './export-csv.service';
import { ArlasStartupService, ArlasCollaborativesearchService } from '../startup/startup.service';

describe('ArlasExportCsvService', () => {
  beforeEach(() =>
  TestBed.configureTestingModule({
    providers: [ArlasStartupService, ArlasCollaborativesearchService]
  }));
  it('should be created', () => {
    const service: ArlasExportCsvService = TestBed.get(ArlasExportCsvService);
    expect(service).toBeTruthy();
  });
});
