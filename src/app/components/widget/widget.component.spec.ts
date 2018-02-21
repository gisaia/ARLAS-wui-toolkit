import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetComponent } from './widget.component';
import { ArlasCollaborativesearchService, ArlasConfigService, ArlasStartupService } from '../../services/startup/startup.service';
import { HistogramModule, ResultsModule } from 'arlas-web-components';
import { PowerbarsModule } from 'arlas-web-components/powerbars/powerbars.module';
import { MatSelectModule } from '@angular/material';
import { HttpModule } from '@angular/http';

describe('WidgetComponent', () => {
  let component: WidgetComponent;
  let fixture: ComponentFixture<WidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WidgetComponent],
      providers: [ArlasCollaborativesearchService, ArlasConfigService, ArlasStartupService],
      imports: [
        HistogramModule,
        PowerbarsModule,
        ResultsModule,
        MatSelectModule,
        HttpModule
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
