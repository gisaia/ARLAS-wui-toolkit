import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatBadgeModule } from '@angular/material/badge';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { BrowserModule } from '@angular/platform-browser';
import {
  TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService, TranslateStore
} from '@ngx-translate/core';
import { DonutModule, HistogramModule, MetricModule, PowerbarsModule, ResultsModule } from 'arlas-web-components';
import { ArlasConfigurationUpdaterService } from '../../../services/configuration-updater/configurationUpdater.service';
import {
  ArlasCollaborativesearchService, ArlasConfigService, ArlasStartupService, CONFIG_UPDATER,
  FETCH_OPTIONS
} from '../../../services/startup/startup.service';
import { HistogramWidgetComponent } from '../../histogram-widget/histogram-widget.component';
import { ProgressSpinnerComponent } from '../../progress-spinner/progress-spinner.component';
import { WidgetComponent } from '../../widget/widget.component';
import { AnalyticsBoardComponent } from './analytics-board.component';
import { RouterModule } from '@angular/router';

describe('AnalyticsBoardComponent', () => {
  let component: AnalyticsBoardComponent;
  let fixture: ComponentFixture<AnalyticsBoardComponent>;
  let arlasStartupService: ArlasStartupService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AnalyticsBoardComponent, WidgetComponent, ProgressSpinnerComponent, HistogramWidgetComponent
      ],
      imports: [
        MatCardModule, MatIconModule, MatExpansionModule, MatSelectModule, MatButtonModule,
        MatTooltipModule, BrowserModule, HistogramModule, ResultsModule, PowerbarsModule,
        DonutModule, RouterModule,
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateFakeLoader } }),
        MatBadgeModule, DragDropModule, HttpClientModule,
        MetricModule, MatProgressSpinnerModule, MatTabsModule
      ],
      providers: [
        ArlasConfigService, ArlasCollaborativesearchService,
        HttpClient, TranslateService, TranslateStore,
        {
          provide: ArlasStartupService,
          useClass: ArlasStartupService,
          deps: [ArlasConfigurationUpdaterService]
        },
        {
          provide: ArlasConfigurationUpdaterService,
          useClass: ArlasConfigurationUpdaterService
        },
        { provide: CONFIG_UPDATER, useValue: {} },
        { provide: FETCH_OPTIONS, useValue: {} }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    arlasStartupService = TestBed.get(ArlasStartupService);
    arlasStartupService.arlasIsUp.subscribe(isUp => {
      if (isUp) {
        fixture = TestBed.createComponent(AnalyticsBoardComponent);
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
