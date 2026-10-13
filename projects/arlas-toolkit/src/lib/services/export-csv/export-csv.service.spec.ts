import { TestBed } from '@angular/core/testing';
import { TranslateLoader, TranslateModule, TranslateNoOpLoader } from '@ngx-translate/core';
import { DateTimeProvider, OAuthLogger, OAuthService, UrlHelperService } from 'angular-oauth2-oidc';
import { beforeEach, describe, expect, it } from 'vitest';
import { GET_OPTIONS } from '../../tools/utils';
import { ArlasCollaborativesearchService } from '../collaborative-search/arlas.collaborative-search.service';
import { ArlasCollectionService } from '../collection/arlas-collection.service';
import { ArlasStartupService, CONFIG_UPDATER, FETCH_OPTIONS } from '../startup/startup.service';
import { ArlasExportCsvService } from './export-csv.service';

describe('ArlasExportCsvService', () => {
  let service: ArlasExportCsvService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateNoOpLoader } })
      ],
      providers: [
        ArlasCollaborativesearchService,
        ArlasStartupService,
        { provide: FETCH_OPTIONS, useValue: {} },
        ArlasCollectionService,
        { provide: GET_OPTIONS, useValue: () => { } },
        { provide: CONFIG_UPDATER, useValue: {} },
        OAuthService,
        OAuthLogger,
        DateTimeProvider,
        UrlHelperService,
      ]
    });

    service = TestBed.inject(ArlasExportCsvService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
