import { DragDropModule } from '@angular/cdk/drag-drop';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService,
  TranslateStore
} from '@ngx-translate/core';
import { DonutModule, HistogramModule, MetricModule, PowerbarsModule, ResultsModule } from 'arlas-web-components';
import {
  ArlasCollaborativesearchService
} from '../../../services/collaborative-search/arlas.collaborative-search.service';
import { ArlasConfigurationUpdaterService } from '../../../services/configuration-updater/configurationUpdater.service';
import {
  ArlasConfigService,
  ArlasStartupService,
  CONFIG_UPDATER,
  FETCH_OPTIONS
} from '../../../services/startup/startup.service';
import { HistogramWidgetComponent } from '../../histogram-widget/histogram-widget.component';
import { ProgressSpinnerComponent } from '../../progress-spinner/progress-spinner.component';
import { WidgetComponent } from '../../widget/widget.component';
import { AnalyticsBoardComponent } from './analytics-board.component';

describe('AnalyticsBoardComponent', () => {
  let component: AnalyticsBoardComponent;
  let fixture: ComponentFixture<AnalyticsBoardComponent>;
  let arlasStartupService: ArlasStartupService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MatCardModule, MatIconModule, MatExpansionModule, MatSelectModule, MatButtonModule,
        MatTooltipModule, BrowserModule, HistogramModule, ResultsModule, PowerbarsModule,
        DonutModule, RouterModule.forRoot([]),
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateFakeLoader } }),
        MatBadgeModule, DragDropModule,
        MetricModule,
        MatProgressSpinnerModule,
        MatTabsModule,
        AnalyticsBoardComponent,
        WidgetComponent,
        ProgressSpinnerComponent,
        HistogramWidgetComponent],
      providers: [
        ArlasConfigService, ArlasCollaborativesearchService,
        TranslateService, TranslateStore,
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
        { provide: FETCH_OPTIONS, useValue: {} },
        provideHttpClient(withInterceptorsFromDi())
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
