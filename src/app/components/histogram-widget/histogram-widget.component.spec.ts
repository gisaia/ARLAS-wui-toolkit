import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistogramWidgetComponent } from './histogram-widget.component';
import { ArlasCollaborativesearchService, ArlasConfigService, ArlasStartupService,
  CONFIG_UPDATER,
  FETCH_OPTIONS} from '../../services/startup/startup.service';
import { HistogramModule, ResultsModule, DonutModule, MetricModule, PowerbarsModule } from 'arlas-web-components';
import { MatSelectModule, MatTooltipModule, MatIconModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateService, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';
import { ArlasConfigurationUpdaterService } from '../../services/configuration-updater/configurationUpdater.service';

describe('HistogramWidgetComponent', () => {
  let component: HistogramWidgetComponent;
  let fixture: ComponentFixture<HistogramWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HistogramWidgetComponent],
      providers: [ArlasCollaborativesearchService, ArlasConfigService,
        {
          provide: ArlasStartupService,
          useClass: ArlasStartupService,
          deps: [ArlasConfigurationUpdaterService]
        },
        TranslateService,
        {provide: CONFIG_UPDATER, useValue: {}},
        {
          provide: ArlasConfigurationUpdaterService,
          useClass: ArlasConfigurationUpdaterService
        },
        {provide: FETCH_OPTIONS, useValue: {}},
      ],
      imports: [
        HistogramModule,
        PowerbarsModule,
        ResultsModule,
        DonutModule,
        MetricModule,
        MatSelectModule,
        HttpClientModule,
        MatTooltipModule,
        MatIconModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
        })
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistogramWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
