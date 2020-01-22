import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {
  MatAutocompleteModule, MatDialogModule, MatIconModule,
  MatInputModule, MatRadioModule, MatSelectModule,
  MatStepperModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ArlasCollaborativesearchService, ArlasConfigService, ArlasStartupService,
  FETCH_OPTIONS } from '../../services/startup/startup.service';
import { ShareComponent } from './share.component';
import { ArlasConfigurationUpdaterService } from '../../services/configuration-updater/configurationUpdater';


describe('ShareComponent', () => {
  let component: ShareComponent;
  let fixture: ComponentFixture<ShareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule, MatAutocompleteModule,
        MatInputModule, FormsModule, BrowserAnimationsModule,
        MatIconModule, HttpClientModule, MatDialogModule, MatStepperModule,
        MatRadioModule, MatSelectModule
      ],
      declarations: [ShareComponent],
      providers: [ArlasConfigService, ArlasCollaborativesearchService, ArlasStartupService,
        {
          provide: ArlasConfigurationUpdaterService,
          useClass: ArlasConfigurationUpdaterService,
          deps: [ArlasCollaborativesearchService]
        },
        {provide: FETCH_OPTIONS, useValue: {}},
]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
