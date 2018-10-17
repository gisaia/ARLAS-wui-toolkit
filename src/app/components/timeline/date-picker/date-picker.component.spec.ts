import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ArlasCollaborativesearchService, ArlasStartupService, ArlasConfigService } from '../../../services/startup/startup.service';
import { DatePickerComponent } from './date-picker.component';
import { MomentDateTimeAdapter } from 'ng-pick-datetime-moment';
import { FormsModule } from '@angular/forms';
import {
  OwlDateTimeModule, DateTimeAdapter, OWL_DATE_TIME_FORMATS,
  OWL_DATE_TIME_LOCALE, OwlNativeDateTimeModule
} from 'ng-pick-datetime';
import { TranslateModule, TranslateLoader, TranslateFakeLoader, TranslateService } from '@ngx-translate/core';
import { HttpModule } from '@angular/http';
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
        OwlDateTimeModule, FormsModule, HttpModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
        })
      ],
      providers: [
        { provide: OWL_DATE_TIME_LOCALE, useValue: 'fr' },

        ArlasCollaborativesearchService, ArlasStartupService, ArlasConfigService, TranslateService,
        { provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE] },
        { provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS },
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
