import { TestBed, inject } from '@angular/core/testing';

import { ArlasStartupService, ArlasConfigService, ArlasCollaborativesearchService, FETCH_OPTIONS } from './startup.service';
import { HttpClientModule } from '@angular/common/http';
import { ArlasConfigurationUpdaterService } from '../configuration-updater/configurationUpdater';

describe('ArlasStartupService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ArlasStartupService, ArlasConfigService, ArlasCollaborativesearchService,
        {
          provide: ArlasConfigurationUpdaterService,
          useClass: ArlasConfigurationUpdaterService,
          deps: [ArlasCollaborativesearchService]
        },
        {provide: FETCH_OPTIONS, useValue: {}}],
      imports: [
        HttpClientModule
      ]
    });
  });

  it('should be created', inject([ArlasStartupService], (service: ArlasStartupService) => {
    expect(service).toBeTruthy();
  }));
});
