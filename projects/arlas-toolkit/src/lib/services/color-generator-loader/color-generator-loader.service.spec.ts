import { TestBed, inject } from '@angular/core/testing';

import { ArlasColorGeneratorLoader } from './color-generator-loader.service';
import { ArlasConfigService, ArlasCollaborativesearchService, ArlasStartupService } from '../startup/startup.service';
import { ArlasToolKitModule } from '../../toolkit.module';
import { ArlasConfigurationUpdaterService } from '../configuration-updater/configurationUpdater.service';

describe('ArlasColorGeneratorLoader', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
      ArlasColorGeneratorLoader,
      {
        provide: ArlasStartupService,
        useClass: ArlasStartupService,
        deps: [ArlasConfigurationUpdaterService]
      },
      {
        provide: ArlasConfigurationUpdaterService,
        useClass: ArlasConfigurationUpdaterService
      },
      ArlasConfigService, ArlasCollaborativesearchService],
      imports: []
    });
  });

  it('should be created', (() => {
    const service: ArlasColorGeneratorLoader = TestBed.get(ArlasColorGeneratorLoader);
    expect(service).toBeTruthy();
  }));
});
