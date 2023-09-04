import { TestBed } from '@angular/core/testing';

import { ArlasAuthentificationService } from './arlas-authentification.service';

describe('ArlasAuthentificationService', () => {
  let service: ArlasAuthentificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArlasAuthentificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
