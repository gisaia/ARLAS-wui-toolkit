import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
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
import { AuthentificationService } from '../../services/authentification/authentification.service';
import { ArlasConfigurationUpdaterService } from '../../services/configuration-updater/configurationUpdater.service';
import {
  ArlasCollaborativesearchService,
  ArlasConfigService,
  CONFIG_UPDATER, FETCH_OPTIONS
} from '../../services/startup/startup.service';
import { ArlasTagService } from '../../services/tag/tag.service';
import { ArlasToolKitModule, getOptionsFactory } from '../../toolkit.module';
import { GET_OPTIONS } from '../../tools/utils';
import { TagComponent } from './tag.component';

describe('TagComponent', () => {
  let component: TagComponent;
  let fixture: ComponentFixture<TagComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TagComponent],
      imports: [ArlasToolKitModule,
        ReactiveFormsModule, MatAutocompleteModule,
        MatInputModule, FormsModule, BrowserAnimationsModule,
        MatIconModule, MatDialogModule, MatStepperModule,
        MatRadioModule, MatSelectModule, MatProgressBarModule, MatSnackBarModule],
      providers: [ArlasConfigService, ArlasCollaborativesearchService,
        ArlasTagService,
        AuthentificationService,
        {
          provide: ArlasConfigurationUpdaterService,
          useClass: ArlasConfigurationUpdaterService
        },
        { provide: FETCH_OPTIONS, useValue: {} },
        { provide: CONFIG_UPDATER, useValue: {} },
        {
          provide: GET_OPTIONS,
          useFactory: getOptionsFactory,
          deps: [AuthentificationService]
        }, HttpClient, provideHttpClient(withInterceptorsFromDi())]
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
