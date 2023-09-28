import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsMenuComponent } from './analytics-menu.component';
import { ArlasStartupService } from '../../../services/startup/startup.service';
import { ArlasConfigurationUpdaterService } from '../../../services/configuration-updater/configurationUpdater.service';

describe('AnalyticsMenuComponent', () => {
  let component: AnalyticsMenuComponent;
  let fixture: ComponentFixture<AnalyticsMenuComponent>;
  let arlasStartupService: ArlasStartupService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalyticsMenuComponent ],
      providers: [
        {
          provide: ArlasStartupService,
          useClass: ArlasStartupService,
          deps: [ArlasConfigurationUpdaterService]
        },
        {
          provide: ArlasConfigurationUpdaterService,
          useClass: ArlasConfigurationUpdaterService
        },
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    arlasStartupService = TestBed.get(ArlasStartupService);
    arlasStartupService.arlasIsUp.subscribe(isUp => {
      if (isUp) {
        fixture = TestBed.createComponent(AnalyticsMenuComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      }
    });
  });

  it('should create', () => {
    arlasStartupService.arlasIsUp.subscribe(isUp => {
      if (isUp) {
        expect(component).toBeTruthy();
      }
    });
  });
});
