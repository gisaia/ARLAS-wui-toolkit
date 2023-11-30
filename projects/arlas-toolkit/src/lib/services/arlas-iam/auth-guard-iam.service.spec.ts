import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthGuardIamService } from './auth-guard-iam.service';

describe('AuthGuardIamService', () => {
  let service: AuthGuardIamService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule]
    });
    service = TestBed.inject(AuthGuardIamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
