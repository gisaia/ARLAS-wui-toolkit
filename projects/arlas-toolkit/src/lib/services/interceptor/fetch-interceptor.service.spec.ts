import { TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { ArlasSettingsService } from '../settings/arlas.settings.service';
import { FetchInterceptorService } from './fetch-interceptor.service';
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';

describe('FetchInterceptorService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      ArlasSettingsService
    ],
    imports: [
      MatDialogModule,
      TranslateModule.forRoot(
        { loader: { provide: TranslateLoader, useClass: TranslateFakeLoader } })
    ]
  }));

  it('should be created', () => {
    const service: FetchInterceptorService = TestBed.get(FetchInterceptorService);
    expect(service).toBeTruthy();
  });
});
