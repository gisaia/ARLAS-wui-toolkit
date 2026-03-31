import { TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateLoader, TranslateModule, TranslateNoOpLoader } from '@ngx-translate/core';
import { beforeEach, describe, expect, it } from 'vitest';
import { ArlasSettingsService } from '../settings/arlas.settings.service';
import { FetchInterceptorService } from './fetch-interceptor.service';

describe('FetchInterceptorService', () => {
  let service: FetchInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ArlasSettingsService
      ],
      imports: [
        MatDialogModule,
        TranslateModule.forRoot(
          { loader: { provide: TranslateLoader, useClass: TranslateNoOpLoader } })
      ]
    });

    service = TestBed.inject(FetchInterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
