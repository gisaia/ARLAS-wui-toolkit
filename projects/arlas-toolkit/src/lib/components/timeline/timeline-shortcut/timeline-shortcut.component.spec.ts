import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OWL_DATE_TIME_LOCALE } from '@danielmoncada/angular-datetime-picker';
import { TranslateLoader, TranslateModule, TranslateNoOpLoader } from '@ngx-translate/core';
import { beforeEach, describe, expect, it } from 'vitest';
import { TEST_CONTRIBUTOR_ID } from '../../../../tests/arlas-config-service.mock';
import { MockArlasStartupService } from '../../../../tests/arlas-startup-service.mock';
import { ArlasCollaborativesearchService } from '../../../services/collaborative-search/arlas.collaborative-search.service';
import { ArlasCollectionService } from '../../../services/collection/arlas-collection.service';
import {
  ArlasConfigService, ArlasStartupService, CONFIG_UPDATER, FETCH_OPTIONS
} from '../../../services/startup/startup.service';
import { GET_OPTIONS } from '../../../tools/utils';
import { TimelineShortcutComponent } from './timeline-shortcut.component';

describe('TimelineShortcutComponent', () => {
  let component: TimelineShortcutComponent;
  let fixture: ComponentFixture<TimelineShortcutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
            loader: { provide: TranslateLoader, useClass: TranslateNoOpLoader }
        }),
        TimelineShortcutComponent
      ],
      providers: [
        { provide: OWL_DATE_TIME_LOCALE, useValue: 'fr' },
        ArlasCollaborativesearchService,
        {
          provide: ArlasStartupService,
          useClass: MockArlasStartupService
        },
        ArlasConfigService,
        { provide: CONFIG_UPDATER, useValue: {} },
        { provide: FETCH_OPTIONS, useValue: {} },
        provideHttpClient(withInterceptorsFromDi()),
        ArlasCollectionService,
        { provide: GET_OPTIONS, useValue: () => { } },
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelineShortcutComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('timelineComponent', { contributorId: TEST_CONTRIBUTOR_ID, input: {} });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
