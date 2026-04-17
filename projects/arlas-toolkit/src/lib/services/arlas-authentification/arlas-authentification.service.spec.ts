import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
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
