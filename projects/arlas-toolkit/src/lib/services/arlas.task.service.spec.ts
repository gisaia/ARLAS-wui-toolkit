import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { GET_OPTIONS } from '../tools/utils';
import { ArlasTaskService } from './arlas.task.service';

describe('ArlasTaskService', () => {
  let service: ArlasTaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: GET_OPTIONS, useValue: () => { } }
      ]
    });
    service = TestBed.inject(ArlasTaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
