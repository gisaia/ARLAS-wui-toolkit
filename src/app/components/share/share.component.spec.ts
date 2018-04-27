import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {
  MatAutocompleteModule, MatDialogModule, MatIconModule,
  MatInputModule, MatRadioModule, MatSelectModule,
  MatStepperModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ArlasCollaborativesearchService, ArlasConfigService, ArlasStartupService } from '../../services/startup/startup.service';
import { ShareComponent } from './share.component';


describe('ShareComponent', () => {
  let component: ShareComponent;
  let fixture: ComponentFixture<ShareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule, MatAutocompleteModule,
        MatInputModule, FormsModule, BrowserAnimationsModule,
        MatIconModule, HttpModule, MatDialogModule, MatStepperModule,
        MatRadioModule, MatSelectModule
      ],
      declarations: [ShareComponent],
      providers: [ArlasConfigService, ArlasCollaborativesearchService, ArlasStartupService]
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
