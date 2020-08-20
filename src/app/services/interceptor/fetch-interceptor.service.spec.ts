import { TestBed } from '@angular/core/testing';

import { FetchInterceptorService } from './fetch-interceptor.service';
import { ArlasSettingsService } from '../settings/arlas.settings.service';
import { MatDialogModule } from '@angular/material';

describe('FetchInterceptorService', () => {
  beforeEach(() => TestBed.configureTestingModule({      providers: [


    ArlasSettingsService,

  ],
  imports: [
    MatDialogModule
  ]}));

  it('should be created', () => {
    const service: FetchInterceptorService = TestBed.get(FetchInterceptorService);
    expect(service).toBeTruthy();
  });
});
