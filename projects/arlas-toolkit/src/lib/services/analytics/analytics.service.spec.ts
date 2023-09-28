import { TestBed } from '@angular/core/testing';

import { AnalyticsService } from './analytics.service';
import { ArlasCollaborativesearchService, ArlasConfigService, ArlasStartupService } from '../startup/startup.service';
import { ArlasConfigurationUpdaterService } from '../configuration-updater/configurationUpdater.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('AnalyticsService', () => {
  let service: AnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      providers: [
        ArlasConfigService,
        ArlasCollaborativesearchService,
        {
          provide: ArlasStartupService,
          useClass: ArlasStartupService,
          deps: [ArlasConfigurationUpdaterService]
        },
        {
          provide: ArlasConfigurationUpdaterService,
          useClass: ArlasConfigurationUpdaterService
        }
      ]
    });
    service = TestBed.inject(AnalyticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
