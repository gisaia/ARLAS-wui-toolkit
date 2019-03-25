import { TestBed } from '@angular/core/testing';

import { ArlasWalkthroughService } from './walkthrough.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

describe('ArlasWalkthroughService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [ArlasWalkthroughService, HttpClient],
    imports: [
      HttpClientModule
    ]
  }));

  it('should be created', () => {
    const service: ArlasWalkthroughService = TestBed.get(ArlasWalkthroughService);
    expect(service).toBeTruthy();
  });
});
