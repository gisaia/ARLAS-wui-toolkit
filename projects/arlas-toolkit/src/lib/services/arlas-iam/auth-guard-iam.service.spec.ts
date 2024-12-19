import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { AuthGuardIamService } from './auth-guard-iam.service';

describe('AuthGuardIamService', () => {
  let service: AuthGuardIamService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([])]
    });
    service = TestBed.inject(AuthGuardIamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
