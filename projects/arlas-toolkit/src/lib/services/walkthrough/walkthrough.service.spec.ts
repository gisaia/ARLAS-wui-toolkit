import { TestBed } from '@angular/core/testing';

import { ArlasWalkthroughService } from './walkthrough.service';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ArlasCollaborativesearchService, ArlasStartupService, CONFIG_UPDATER, FETCH_OPTIONS } from '../startup/startup.service';
import { ArlasMapSettings } from '../map-settings/map-settings.service';
import { ArlasMapService } from '../map/map.service';
import { TranslateService, TranslateStore, TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';
import { ArlasConfigurationUpdaterService } from '../configuration-updater/configurationUpdater.service';
import { ArlasWalkthroughModule } from './walkthrough.module';

describe('ArlasWalkthroughService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateFakeLoader } }),
        ArlasWalkthroughModule.forRoot({})],
    providers: [
        ArlasWalkthroughService,
        HttpClient,
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
