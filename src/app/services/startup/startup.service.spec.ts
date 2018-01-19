import { TestBed, inject } from '@angular/core/testing';

import { ArlasStartupService } from './startup.service';

describe('ArlasStartupService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ArlasStartupService]
    });
  });

  it('should be created', inject([ArlasStartupService], (service: ArlasStartupService) => {
    expect(service).toBeTruthy();
  }));
});
