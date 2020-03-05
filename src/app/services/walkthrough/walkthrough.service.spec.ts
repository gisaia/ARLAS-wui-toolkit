import { TestBed } from '@angular/core/testing';

import { ArlasWalkthroughService } from './walkthrough.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ArlasCollaborativesearchService } from '../startup/startup.service';
import { ArlasMapSettings } from '../map-settings/map-settings.service';

describe('ArlasWalkthroughService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [ArlasWalkthroughService, HttpClient, ArlasCollaborativesearchService, ArlasMapSettings],
    imports: [
      HttpClientModule
    ]
  }));

  it('should be created', () => {
    const service: ArlasWalkthroughService = TestBed.get(ArlasWalkthroughService);
    expect(service).toBeTruthy();
  });
});
