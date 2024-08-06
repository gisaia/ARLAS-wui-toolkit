import { TestBed } from '@angular/core/testing';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { ArlasSettingsService } from '../settings/arlas.settings.service';
import { FetchInterceptorService } from './fetch-interceptor.service';

describe('FetchInterceptorService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      ArlasSettingsService
    ],
    imports: [
      MatDialogModule
    ]
  }));

  it('should be created', () => {
    const service: FetchInterceptorService = TestBed.get(FetchInterceptorService);
    expect(service).toBeTruthy();
  });
});
