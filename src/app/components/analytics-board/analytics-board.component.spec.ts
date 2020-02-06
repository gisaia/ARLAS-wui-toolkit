import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatCardModule,
  MatIconModule,
  MatExpansionModule,
  MatSelectModule,
  MatButtonModule,
  MatTooltipModule,
  MatBadgeModule,
  MatProgressSpinnerModule,
  MatTabsModule
} from '@angular/material';
import { AnalyticsBoardComponent } from './analytics-board.component';
import { WidgetComponent } from '../widget/widget.component';
import { ProgressSpinnerComponent } from '../progress-spinner/progress-spinner.component';
import { BrowserModule } from '@angular/platform-browser';
import {
  HistogramModule, ResultsModule, PowerbarsModule, DonutModule, MetricModule
} from 'arlas-web-components';
import {
  TranslateModule, TranslateService, TranslateStore, TranslateLoader,
  TranslateFakeLoader
} from '@ngx-translate/core';
import {
  ArlasStartupService, ArlasConfigService, ArlasCollaborativesearchService,
  CONFIG_UPDATER,
  FETCH_OPTIONS
} from '../../services/startup/startup.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ArlasConfigurationUpdaterService } from '../../services/configuration-updater/configurationUpdater.service';

describe('AnalyticsBoardComponent', () => {
  let component: AnalyticsBoardComponent;
  let fixture: ComponentFixture<AnalyticsBoardComponent>;
  let arlasStartupService: ArlasStartupService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AnalyticsBoardComponent, WidgetComponent, ProgressSpinnerComponent
      ],
      imports: [
        MatCardModule, MatIconModule, MatExpansionModule, MatSelectModule, MatButtonModule,
        MatTooltipModule, BrowserModule, HistogramModule, ResultsModule, PowerbarsModule,
        DonutModule,
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateFakeLoader } })
        , MatBadgeModule, DragDropModule, HttpClientModule,
        MetricModule, MatProgressSpinnerModule, MatTabsModule
      ],
      providers: [
        ArlasConfigService, ArlasCollaborativesearchService,
        ArlasStartupService, HttpClient, TranslateService, TranslateStore,
        { provide: CONFIG_UPDATER, useValue: {} },
        {
          provide: ArlasConfigurationUpdaterService,
          useClass: ArlasConfigurationUpdaterService,
          deps: [ArlasCollaborativesearchService]
        },
        {provide: FETCH_OPTIONS, useValue: {}}
      ]
    })
      .compileComponents();
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
