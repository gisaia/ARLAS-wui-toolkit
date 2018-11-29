import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateLoader, TranslateFakeLoader, TranslateService } from '@ngx-translate/core';
import { TimelineShortcutComponent } from './timeline-shortcut.component';
import { DatePickerComponent } from '../../timeline/date-picker/date-picker.component';
import { ArlasCollaborativesearchService, ArlasStartupService, ArlasConfigService } from '../../../services/startup/startup.service';
import { OwlDateTimeModule } from 'ng-pick-datetime';
import { FormsModule } from '@angular/forms';
import {
  MatButtonModule, MatCardModule, MatExpansionModule, MatIconModule, MatSelectModule,
  MatTooltipModule, MatChipsModule
} from '@angular/material';
import {
  OWL_DATE_TIME_LOCALE
} from 'ng-pick-datetime';
import { BrowserModule } from '@angular/platform-browser';
import { GetTimeLabelPipe } from '../../../.../../pipes/get-time-label.pipe';
import { HttpClient, HttpClientModule } from '@angular/common/http';

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
        ArlasCollaborativesearchService, ArlasStartupService, ArlasConfigService, TranslateService,

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
