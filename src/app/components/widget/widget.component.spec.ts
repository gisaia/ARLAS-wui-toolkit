import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetComponent } from './widget.component';
import { ArlasCollaborativesearchService, ArlasConfigService, ArlasStartupService,
  CONFIG_UPDATER,
  FETCH_OPTIONS} from '../../services/startup/startup.service';
import { HistogramModule, ResultsModule, DonutModule, MetricModule, PowerbarsModule } from 'arlas-web-components';
import { MatSelectModule, MatTooltipModule, MatIconModule, MatProgressSpinnerModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateService, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';
import { ArlasConfigurationUpdaterService } from '../../services/configuration-updater/configurationUpdater.service';
import { HistogramWidgetComponent } from '../histogram-widget/histogram-widget.component';
import { ProgressSpinnerComponent } from '../progress-spinner/progress-spinner.component';
import { ArlasOverlayService } from '../../services/overlays/overlay.service';

describe('WidgetComponent', () => {
  let component: WidgetComponent;
  let fixture: ComponentFixture<WidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WidgetComponent, HistogramWidgetComponent, ProgressSpinnerComponent],
      providers: [ArlasCollaborativesearchService, ArlasConfigService,
        {
          provide: ArlasStartupService,
          useClass: ArlasStartupService,
          deps: [ArlasConfigurationUpdaterService]
        },
        TranslateService,
        ArlasOverlayService,
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
        MatProgressSpinnerModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
        })
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
