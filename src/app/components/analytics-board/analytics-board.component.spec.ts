import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatCardModule,
  MatIconModule,
  MatExpansionModule,
  MatSelectModule,
  MatButtonModule,
  MatTooltipModule
} from '@angular/material';
import { AnalyticsBoardComponent } from './analytics-board.component';
import { WidgetComponent } from '../widget/widget.component';
import { BrowserModule } from '@angular/platform-browser';
import {
  HistogramModule, ResultsModule, PowerbarsModule, DonutModule
} from 'arlas-web-components';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

describe('AnalyticsBoardComponent', () => {
  let component: AnalyticsBoardComponent;
  let fixture: ComponentFixture<AnalyticsBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AnalyticsBoardComponent, WidgetComponent
      ],
      imports: [
        MatCardModule, MatIconModule, MatExpansionModule, MatSelectModule, MatButtonModule,
        MatTooltipModule, BrowserModule, HistogramModule, ResultsModule, PowerbarsModule, DonutModule, TranslateModule
      ],
      providers: [
        TranslateService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
