import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { ArlasIamService } from './arlas-iam.service';

describe('ArlasIamService', () => {
  let service: ArlasIamService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([])]
    });
    service = TestBed.inject(ArlasIamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
