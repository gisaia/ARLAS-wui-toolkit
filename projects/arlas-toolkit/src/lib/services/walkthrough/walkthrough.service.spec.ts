import { TestBed } from '@angular/core/testing';

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService, TranslateStore } from '@ngx-translate/core';
import { ArlasCollaborativesearchService } from '../collaborative-search/arlas.collaborative-search.service';
import { ArlasConfigurationUpdaterService } from '../configuration-updater/configurationUpdater.service';
import { ArlasMapSettings } from '../map-settings/map-settings.service';
import { ArlasMapService } from '../map/map.service';
import { ArlasStartupService, CONFIG_UPDATER, FETCH_OPTIONS } from '../startup/startup.service';
import { ArlasWalkthroughModule } from './walkthrough.module';
import { ArlasWalkthroughService } from './walkthrough.service';

describe('ArlasWalkthroughService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateFakeLoader } }),
      ArlasWalkthroughModule.forRoot({})],
    providers: [
      ArlasWalkthroughService,
      TranslateService,
      TranslateStore,
      {
        provide: ArlasStartupService,
        useClass: ArlasStartupService,
        deps: [ArlasConfigurationUpdaterService]
      },
      ArlasCollaborativesearchService,
      {
        provide: ArlasConfigurationUpdaterService,
        useClass: ArlasConfigurationUpdaterService
      },
      { provide: FETCH_OPTIONS, useValue: {} }, ArlasMapSettings,
      ArlasMapService,
      { provide: CONFIG_UPDATER, useValue: {} },
      provideHttpClient(withInterceptorsFromDi())
    ]
  }));

  it('should be created', () => {
    const service: ArlasWalkthroughService = TestBed.get(ArlasWalkthroughService);
    expect(service).toBeTruthy();
  });
});
