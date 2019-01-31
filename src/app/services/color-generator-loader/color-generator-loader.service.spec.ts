import { TestBed, inject } from '@angular/core/testing';

import { ArlasColorGeneratorLoader } from './color-generator-loader.service';
import { ArlasConfigService, ArlasCollaborativesearchService } from '../startup/startup.service';
import { ArlasToolKitModule } from '../../app.module';

describe('ArlasColorGeneratorLoader', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ArlasConfigService, ArlasCollaborativesearchService],
      imports: [ArlasToolKitModule]
    });
  });

  it('should be created', inject([ArlasColorGeneratorLoader], (service: ArlasColorGeneratorLoader) => {
    expect(service).toBeTruthy();
  }));
});
