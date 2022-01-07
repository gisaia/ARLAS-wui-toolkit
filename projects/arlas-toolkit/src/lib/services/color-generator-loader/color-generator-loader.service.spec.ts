import { TestBed } from '@angular/core/testing';
import { ArlasConfigurationUpdaterService } from '../configuration-updater/configurationUpdater.service';
import { ArlasCollaborativesearchService, ArlasConfigService, ArlasStartupService } from '../startup/startup.service';
import { ArlasColorGeneratorLoader } from './color-generator-loader.service';


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
