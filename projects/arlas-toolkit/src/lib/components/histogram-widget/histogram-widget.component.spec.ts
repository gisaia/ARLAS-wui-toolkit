import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateLoader, TranslateModule, TranslateNoOpLoader } from '@ngx-translate/core';
import {
  ArlasColorService,
  AwcColorGeneratorLoader, ColorGeneratorLoader, ColorGeneratorModule
} from 'arlas-web-components';
import { HistogramContributor } from 'arlas-web-contributors';
import { beforeEach, describe, expect, it } from 'vitest';
import { MockArlasConfigService, TEST_CONTRIBUTOR_ID } from '../../../tests/arlas-config-service.mock';
import { ArlasCollaborativesearchService } from '../../services/collaborative-search/arlas.collaborative-search.service';
import { ArlasCollectionService } from '../../services/collection/arlas-collection.service';
import { ArlasExportCsvService } from '../../services/export-csv/export-csv.service';
import { ArlasOverlayService } from '../../services/overlays/overlay.service';
import {
  ArlasConfigService,
  CONFIG_UPDATER,
  FETCH_OPTIONS
} from '../../services/startup/startup.service';
import { HistogramWidgetComponent } from './histogram-widget.component';

describe('HistogramWidgetComponent', () => {
  let component: HistogramWidgetComponent;
  let fixture: ComponentFixture<HistogramWidgetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
            loader: { provide: TranslateLoader, useClass: TranslateNoOpLoader }
        }),
        ColorGeneratorModule.forRoot({
            loader: {
                provide: ColorGeneratorLoader,
                useClass: AwcColorGeneratorLoader
            }
        }),
        HistogramWidgetComponent
      ],
      providers: [
        ArlasCollaborativesearchService,
        {
          provide: ArlasConfigService,
          useClass: MockArlasConfigService
        },
        ArlasColorService,
        ArlasOverlayService,
        { provide: CONFIG_UPDATER, useValue: {} },
        { provide: FETCH_OPTIONS, useValue: {} },
        provideHttpClient(withInterceptorsFromDi()),
        ArlasExportCsvService,
        ArlasCollectionService,
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistogramWidgetComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('componentInputs', { chartHeight: 100 });
    fixture.componentRef.setInput('contributor',
      new HistogramContributor(TEST_CONTRIBUTOR_ID, TestBed.inject(ArlasCollaborativesearchService), TestBed.inject(ArlasConfigService), 'test'));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
