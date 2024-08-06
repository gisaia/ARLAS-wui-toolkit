import { HttpClient, HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { OwlDateTimeModule, OWL_DATE_TIME_LOCALE } from '@danielmoncada/angular-datetime-picker';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { GetTimeLabelPipe } from '../../../pipes/get-time-label.pipe';
import { ArlasConfigurationUpdaterService } from '../../../services/configuration-updater/configurationUpdater.service';
import {
  ArlasCollaborativesearchService, ArlasConfigService, ArlasStartupService, CONFIG_UPDATER, FETCH_OPTIONS
} from '../../../services/startup/startup.service';
import { DatePickerComponent } from '../date-picker/date-picker.component';
import { TimelineShortcutComponent } from './timeline-shortcut.component';

describe('TimelineShortcutComponent', () => {
  let component: TimelineShortcutComponent;
  let fixture: ComponentFixture<TimelineShortcutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TimelineShortcutComponent, DatePickerComponent, GetTimeLabelPipe],
      imports: [
        MatCardModule, MatIconModule, MatExpansionModule, MatSelectModule, MatButtonModule, MatChipsModule,
        OwlDateTimeModule, FormsModule, HttpClientModule,
        MatTooltipModule, BrowserModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
        })
      ],
      providers: [
        { provide: OWL_DATE_TIME_LOCALE, useValue: 'fr' }, HttpClient,
        ArlasCollaborativesearchService,
        {
          provide: ArlasStartupService,
          useClass: ArlasStartupService,
          deps: [ArlasConfigurationUpdaterService]
        },
        ArlasConfigService, TranslateService,
        { provide: CONFIG_UPDATER, useValue: {} },
        {
          provide: ArlasConfigurationUpdaterService,
          useClass: ArlasConfigurationUpdaterService
        },
        {provide: FETCH_OPTIONS, useValue: {}}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelineShortcutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
