import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetComponent } from './widget.component';
import { ArlasCollaborativesearchService, ArlasConfigService, ArlasStartupService,
  CONFIG_UPDATER } from '../../services/startup/startup.service';
import { HistogramModule, ResultsModule, DonutModule, MetricModule, PowerbarsModule } from 'arlas-web-components';
import { MatSelectModule, MatTooltipModule, MatIconModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateService, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';

describe('WidgetComponent', () => {
  let component: WidgetComponent;
  let fixture: ComponentFixture<WidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WidgetComponent],
      providers: [ArlasCollaborativesearchService, ArlasConfigService, ArlasStartupService, TranslateService,
        {provide: CONFIG_UPDATER, useValue: {}}],
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
    fixture = TestBed.createComponent(WidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
