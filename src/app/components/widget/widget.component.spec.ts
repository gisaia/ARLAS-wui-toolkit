import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetComponent } from './widget.component';
import { ArlasCollaborativesearchService, ArlasConfigService, ArlasStartupService } from '../../services/startup/startup.service';
import { HistogramModule, ResultsModule, DonutModule } from 'arlas-web-components';
import { PowerbarsModule } from 'arlas-web-components/powerbars/powerbars.module';
import { MatSelectModule } from '@angular/material';
import { HttpModule } from '@angular/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

describe('WidgetComponent', () => {
  let component: WidgetComponent;
  let fixture: ComponentFixture<WidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WidgetComponent],
      providers: [ArlasCollaborativesearchService, ArlasConfigService, ArlasStartupService, TranslateService],
      imports: [
        HistogramModule,
        PowerbarsModule,
        ResultsModule,
        DonutModule,
        MatSelectModule,
        HttpModule,
        TranslateModule
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
