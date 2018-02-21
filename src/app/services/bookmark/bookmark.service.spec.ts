import { TestBed, inject } from '@angular/core/testing';

import { ArlasBookmarkService } from './bookmark.service';
import { ArlasCollaborativesearchService } from '../startup/startup.service';
import { MatSnackBarModule } from '@angular/material';
import { RouterModule} from '@angular/router';
import { HttpModule } from '@angular/http';
import { routing } from '../../app.routes';
import { ArlasToolKitModule } from '../../app.module';
import { APP_BASE_HREF } from '@angular/common';

describe('BookmarkService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ArlasBookmarkService, ArlasCollaborativesearchService, { provide: APP_BASE_HREF, useValue: '/' }],
      imports: [MatSnackBarModule, RouterModule, HttpModule, routing, ArlasToolKitModule]

    });
  });

  it('should be created', inject([ArlasBookmarkService], (service: ArlasBookmarkService) => {
    expect(service).toBeTruthy();
  }));
});
