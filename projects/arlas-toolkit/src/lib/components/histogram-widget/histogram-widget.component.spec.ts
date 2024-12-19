import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  ArlasColorService,
  AwcColorGeneratorLoader, ColorGeneratorLoader, ColorGeneratorModule,
  DonutModule,
  HistogramModule,
  MetricModule, PowerbarsModule,
  ResultsModule
} from 'arlas-web-components';
import { ArlasCollaborativesearchService } from '../../services/collaborative-search/arlas.collaborative-search.service';
import { ArlasCollectionService } from '../../services/collection/arlas-collection.service';
import { ArlasConfigurationUpdaterService } from '../../services/configuration-updater/configurationUpdater.service';
import { ArlasExportCsvService } from '../../services/export-csv/export-csv.service';
import { ArlasOverlayService } from '../../services/overlays/overlay.service';
import {
  ArlasConfigService, ArlasStartupService,
  CONFIG_UPDATER,
  FETCH_OPTIONS
} from '../../services/startup/startup.service';
import { ProgressSpinnerComponent } from '../progress-spinner/progress-spinner.component';
import { HistogramWidgetComponent } from './histogram-widget.component';
import { ContributorUpdatingPipe } from '../../pipes/contributor-updating.pipe';

describe('HistogramWidgetComponent', () => {
  let component: HistogramWidgetComponent;
  let fixture: ComponentFixture<HistogramWidgetComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HistogramWidgetComponent, ProgressSpinnerComponent, ContributorUpdatingPipe],
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
        }),
        ColorGeneratorModule.forRoot({
          loader: {
            provide: ColorGeneratorLoader,
            useClass: AwcColorGeneratorLoader
          }
        })],
      providers: [
        ArlasCollaborativesearchService,
        ArlasConfigService,
        ArlasColorService,
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
        provideHttpClient(withInterceptorsFromDi()),
        ArlasExportCsvService,
        ArlasCollectionService,
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistogramWidgetComponent);
    component = fixture.componentInstance;
    component.componentInputs = {};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
