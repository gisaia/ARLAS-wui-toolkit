import { HttpClient, HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { OwlDateTimeModule, OWL_DATE_TIME_LOCALE } from '@gisaia-team/ng-pick-datetime';
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
