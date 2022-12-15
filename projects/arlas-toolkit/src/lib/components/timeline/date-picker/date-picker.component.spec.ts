import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ArlasCollaborativesearchService, ArlasStartupService, ArlasConfigService,
  CONFIG_UPDATER,
  FETCH_OPTIONS} from '../../../services/startup/startup.service';
import { DatePickerComponent } from './date-picker.component';

import { FormsModule } from '@angular/forms';
import {
  OwlDateTimeModule, DateTimeAdapter, OWL_DATE_TIME_FORMATS,
  OWL_DATE_TIME_LOCALE
} from '@danielmoncada/angular-datetime-picker';
import { MomentDateTimeAdapter } from '@danielmoncada/angular-datetime-picker-moment-adapter';
import { TranslateModule, TranslateLoader, TranslateFakeLoader, TranslateService } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ArlasConfigurationUpdaterService } from '../../../services/configuration-updater/configurationUpdater.service';
export const MY_CUSTOM_FORMATS = {
  parseInput: 'lll',
  fullPickerInput: 'll LTS',
  datePickerInput: 'lll',
  timePickerInput: 'lll',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'lll',
  monthYearA11yLabel: 'MMMM YYYY',
};
describe('DatePickerComponent', () => {
  let component: DatePickerComponent;
  let fixture: ComponentFixture<DatePickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DatePickerComponent],
      imports: [
        OwlDateTimeModule, FormsModule, HttpClientModule,
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
        { provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE] },
        { provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS },
        {provide: CONFIG_UPDATER, useValue: {}},
        {
          provide: ArlasConfigurationUpdaterService,
          useClass: ArlasConfigurationUpdaterService
        },
        {provide: FETCH_OPTIONS, useValue: {}},
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
