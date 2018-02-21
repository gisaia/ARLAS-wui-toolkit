import { TestBed, inject } from '@angular/core/testing';

import { ArlasStartupService, ArlasConfigService, ArlasCollaborativesearchService } from './startup.service';
import { HttpModule } from '@angular/http';

describe('ArlasStartupService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ArlasStartupService, ArlasConfigService, ArlasCollaborativesearchService],
      imports: [
        HttpModule
      ]
    });
  });

  it('should be created', inject([ArlasStartupService], (service: ArlasStartupService) => {
    expect(service).toBeTruthy();
  }));
});
