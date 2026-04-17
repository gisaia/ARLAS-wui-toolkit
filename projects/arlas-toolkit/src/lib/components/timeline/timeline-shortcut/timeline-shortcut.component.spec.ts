import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OWL_DATE_TIME_LOCALE } from '@danielmoncada/angular-datetime-picker';
import { TranslateLoader, TranslateModule, TranslateNoOpLoader } from '@ngx-translate/core';
import { beforeEach, describe, expect, it } from 'vitest';
import { ArlasCollaborativesearchService } from '../../../services/collaborative-search/arlas.collaborative-search.service';
import { ArlasCollectionService } from '../../../services/collection/arlas-collection.service';
import { ArlasConfigurationUpdaterService } from '../../../services/configuration-updater/configurationUpdater.service';
import {
  ArlasConfigService, ArlasStartupService, CONFIG_UPDATER, FETCH_OPTIONS
} from '../../../services/startup/startup.service';
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
            useClass: ArlasStartupService,
            deps: [ArlasConfigurationUpdaterService]
        },
        ArlasConfigService,
        { provide: CONFIG_UPDATER, useValue: {} },
        {
            provide: ArlasConfigurationUpdaterService,
            useClass: ArlasConfigurationUpdaterService
        },
        { provide: FETCH_OPTIONS, useValue: {} },
        provideHttpClient(withInterceptorsFromDi()),
        ArlasCollectionService
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelineShortcutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
