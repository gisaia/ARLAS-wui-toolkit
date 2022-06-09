import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ArlasIamService } from './arlas-iam.service';

describe('ArlasIamService', () => {
  let service: ArlasIamService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule]
    });
    service = TestBed.inject(ArlasIamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
