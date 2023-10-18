import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistogramWidgetComponent } from './histogram-widget.component';
import {
  ArlasCollaborativesearchService, ArlasConfigService, ArlasStartupService,
  CONFIG_UPDATER,
  FETCH_OPTIONS
} from '../../services/startup/startup.service';
import { HistogramModule, ResultsModule, DonutModule, MetricModule, PowerbarsModule,
  AwcColorGeneratorLoader, ColorGeneratorLoader, ColorGeneratorModule, ArlasColorService } from 'arlas-web-components';

import { HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateService, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';
import { ArlasConfigurationUpdaterService } from '../../services/configuration-updater/configurationUpdater.service';
import { ProgressSpinnerComponent } from '../progress-spinner/progress-spinner.component';
import { ArlasOverlayService } from '../../services/overlays/overlay.service';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DEFAULT_SHORTCUT_WIDTH, SHORTCUT_WIDTH } from '../../tools/utils';

describe('HistogramWidgetComponent', () => {
  let component: HistogramWidgetComponent;
  let fixture: ComponentFixture<HistogramWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HistogramWidgetComponent, ProgressSpinnerComponent],
      providers: [ArlasCollaborativesearchService, ArlasConfigService, ArlasColorService,
        {
          provide: ArlasStartupService,
          useClass: ArlasStartupService,
          deps: [ArlasConfigurationUpdaterService]
        },
        TranslateService,
        ArlasOverlayService,
        { provide: CONFIG_UPDATER, useValue: {} },
        {
          provide: ArlasConfigurationUpdaterService,
          useClass: ArlasConfigurationUpdaterService
        },
        { provide: FETCH_OPTIONS, useValue: {} },
        { provide: SHORTCUT_WIDTH, useValue: DEFAULT_SHORTCUT_WIDTH }
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
        }),
        ColorGeneratorModule.forRoot({
          loader: {
            provide: ColorGeneratorLoader,
            useClass: AwcColorGeneratorLoader
          }
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
