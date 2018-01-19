import { TestBed, inject } from '@angular/core/testing';

import { ArlasBookmarkService } from './bookmark.service';

describe('BookmarkService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ArlasBookmarkService]
    });
  });

  it('should be created', inject([ArlasBookmarkService], (service: ArlasBookmarkService) => {
    expect(service).toBeTruthy();
  }));
});
