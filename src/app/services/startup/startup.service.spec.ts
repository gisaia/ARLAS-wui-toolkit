import { TestBed, inject } from '@angular/core/testing';

import { ArlasStartupService, ArlasConfigService, ArlasCollaborativesearchService } from './startup.service';
import { HttpClientModule } from '@angular/common/http';

describe('ArlasStartupService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ArlasStartupService, ArlasConfigService, ArlasCollaborativesearchService],
      imports: [
        HttpClientModule
      ]
    });
  });

  it('should be created', inject([ArlasStartupService], (service: ArlasStartupService) => {
    expect(service).toBeTruthy();
  }));
});
