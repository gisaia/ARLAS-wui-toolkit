import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { TranslateLoader, TranslateModule, TranslateNoOpLoader } from '@ngx-translate/core';
import { ArlasCollaborativesearchService } from '../collaborative-search/arlas.collaborative-search.service';
import { ArlasConfigurationUpdaterService } from '../configuration-updater/configurationUpdater.service';
import { ArlasMapSettings } from '../map-settings/map-settings.service';
import { ArlasMapService } from '../map/map.service';
import { ArlasStartupService, CONFIG_UPDATER, FETCH_OPTIONS } from '../startup/startup.service';
import { ArlasWalkthroughModule } from './walkthrough.module';
import { ArlasWalkthroughService } from './walkthrough.service';

describe('ArlasWalkthroughService', () => {
  let service: ArlasWalkthroughService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateNoOpLoader } }),
        ArlasWalkthroughModule.forRoot({})],
      providers: [
        ArlasWalkthroughService,
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
    });

    service = TestBed.inject(ArlasWalkthroughService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
