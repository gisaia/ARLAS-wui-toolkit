import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatCardModule,
  MatIconModule,
  MatExpansionModule,
  MatSelectModule,
  MatButtonModule,
  MatTooltipModule,
  MatBadgeModule,
  MatProgressSpinnerModule
} from '@angular/material';
import { AnalyticsBoardComponent } from './analytics-board.component';
import { WidgetComponent } from '../widget/widget.component';
import { ProgressSpinnerComponent } from '../progress-spinner/progress-spinner.component';
import { BrowserModule } from '@angular/platform-browser';
import {
  HistogramModule, ResultsModule, PowerbarsModule, DonutModule, MetricModule
} from 'arlas-web-components';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ArlasStartupService, ArlasConfigService, ArlasCollaborativesearchService } from '../../services/startup/startup.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DragDropModule } from '@angular/cdk/drag-drop';

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
        DonutModule, TranslateModule, MatBadgeModule, DragDropModule, HttpClientModule,
        MetricModule, MatProgressSpinnerModule
      ],
      providers: [
        ArlasConfigService, ArlasCollaborativesearchService,
        ArlasStartupService, HttpClient, TranslateService
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
