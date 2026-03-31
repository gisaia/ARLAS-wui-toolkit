import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { ArlasConfigurationUpdaterService } from '../../../services/configuration-updater/configurationUpdater.service';
import { ArlasStartupService } from '../../../services/startup/startup.service';
import { AnalyticsMenuComponent } from './analytics-menu.component';

describe('AnalyticsMenuComponent', () => {
  let component: AnalyticsMenuComponent;
  let fixture: ComponentFixture<AnalyticsMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [
        RouterModule.forRoot([]),
        AnalyticsMenuComponent
    ],
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

    fixture = TestBed.createComponent(AnalyticsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
