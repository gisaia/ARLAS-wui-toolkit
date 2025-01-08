import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { DonutModule, HistogramModule, MetricModule, PowerbarsModule, ResultsModule } from 'arlas-web-components';
import { ArlasCollaborativesearchService } from '../../services/collaborative-search/arlas.collaborative-search.service';
import { ArlasCollectionService } from '../../services/collection/arlas-collection.service';
import { ArlasConfigurationUpdaterService } from '../../services/configuration-updater/configurationUpdater.service';
import { ArlasOverlayService } from '../../services/overlays/overlay.service';
import {
  ArlasConfigService, ArlasStartupService,
  CONFIG_UPDATER,
  FETCH_OPTIONS
} from '../../services/startup/startup.service';
import { HistogramWidgetComponent } from '../histogram-widget/histogram-widget.component';
import { ProgressSpinnerComponent } from '../progress-spinner/progress-spinner.component';
import { WidgetComponent } from './widget.component';

describe('WidgetComponent', () => {
  let component: WidgetComponent;
  let fixture: ComponentFixture<WidgetComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [HistogramModule,
        PowerbarsModule,
        ResultsModule,
        DonutModule,
        MetricModule,
        MatSelectModule,
        MatTooltipModule,
        MatIconModule,
        MatProgressSpinnerModule,
        TranslateModule.forRoot({
            loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
        }), WidgetComponent, HistogramWidgetComponent, ProgressSpinnerComponent],
    providers: [
        ArlasCollaborativesearchService,
        ArlasConfigService,
        {
            provide: ArlasStartupService,
            useClass: ArlasStartupService,
            deps: [ArlasConfigurationUpdaterService]
        },
        TranslateService,
        ArlasOverlayService,
        { provide: CONFIG_UPDATER, useValue: {} },
        ArlasConfigurationUpdaterService,
        { provide: FETCH_OPTIONS, useValue: {} },
        provideHttpClient(withInterceptorsFromDi()),
        ArlasCollectionService
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
