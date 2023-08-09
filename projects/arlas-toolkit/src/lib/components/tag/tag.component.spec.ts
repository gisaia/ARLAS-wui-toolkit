import { HttpClient, HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ArlasConfigurationUpdaterService } from '../../services/configuration-updater/configurationUpdater.service';
import {
  ArlasCollaborativesearchService,
  ArlasConfigService, ArlasStartupService, FETCH_OPTIONS
} from '../../services/startup/startup.service';
import { ArlasTagService } from '../../services/tag/tag.service';
import { TagComponent } from './tag.component';
import { GET_OPTIONS } from '../../tools/utils';
import { ToolKitAppModule } from 'app/app.module';
import { ArlasToolKitModule, getOptionsFactory } from '../../toolkit.module';
import { AuthentificationService } from '../../services/authentification/authentification.service';

describe('TagComponent', () => {
  let component: TagComponent;
  let fixture: ComponentFixture<TagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ArlasToolKitModule,
        ReactiveFormsModule, MatAutocompleteModule,
        MatInputModule, FormsModule, BrowserAnimationsModule,
        MatIconModule, HttpClientModule, MatDialogModule, MatStepperModule,
        MatRadioModule, MatSelectModule, MatProgressBarModule, MatSnackBarModule
      ],
      declarations: [TagComponent],
      providers: [ArlasConfigService, ArlasCollaborativesearchService,
        ArlasTagService,
        AuthentificationService,
        {
          provide: ArlasConfigurationUpdaterService,
          useClass: ArlasConfigurationUpdaterService
        },
        { provide: FETCH_OPTIONS, useValue: {} },
        {
          provide: GET_OPTIONS,
          useFactory: getOptionsFactory,
          deps: [AuthentificationService]
        }, HttpClient
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
