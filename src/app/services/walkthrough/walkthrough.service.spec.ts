import { TestBed } from '@angular/core/testing';

import { ArlasWalkthroughService } from './walkthrough.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ArlasCollaborativesearchService, ArlasStartupService, CONFIG_UPDATER } from '../startup/startup.service';
import { ArlasMapSettings } from '../map-settings/map-settings.service';
import { ArlasMapService } from '../map/map.service';
import { TranslateService, TranslateStore, TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';

describe('ArlasWalkthroughService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      ArlasStartupService,
      ArlasWalkthroughService,
      HttpClient,
      TranslateService,
      TranslateStore,
      ArlasCollaborativesearchService,
      ArlasMapSettings,
      ArlasMapService,
      { provide: CONFIG_UPDATER, useValue: {} }
    ],
    imports: [
      HttpClientModule,
      TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateFakeLoader } })
    ]
  }));

  it('should be created', () => {
    const service: ArlasWalkthroughService = TestBed.get(ArlasWalkthroughService);
    expect(service).toBeTruthy();
  });
});
