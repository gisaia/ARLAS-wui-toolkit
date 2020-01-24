import { TestBed, inject } from '@angular/core/testing';

import {
  ArlasStartupService, ArlasConfigService, ArlasCollaborativesearchService,
  CONFIG_UPDATER
} from './startup.service';
import { HttpClientModule } from '@angular/common/http';
import {
  TranslateModule, TranslateService, TranslateLoader,
  TranslateFakeLoader, TranslateStore
} from '@ngx-translate/core';
describe('ArlasStartupService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ArlasStartupService, ArlasConfigService, ArlasCollaborativesearchService,
        TranslateService, TranslateStore,
        { provide: CONFIG_UPDATER, useValue: {} }],
      imports: [
        HttpClientModule,
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateFakeLoader } })
      ]
    });
  });

  it('should be created', inject([ArlasStartupService], (service: ArlasStartupService) => {
    expect(service).toBeTruthy();
  }));
});
