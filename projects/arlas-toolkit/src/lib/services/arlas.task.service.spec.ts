import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { ArlasTaskService } from './arlas.task.service';

describe('ArlasTaskService', () => {
  let service: ArlasTaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArlasTaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
