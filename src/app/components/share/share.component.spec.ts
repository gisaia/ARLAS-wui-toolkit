import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareComponent } from './share.component';
import {
  ArlasConfigService,
  ArlasCollaborativesearchService,
  ArlasStartupService
} from '../../services/startup/startup.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {
  MatAutocompleteModule, MatInputModule, MatIconModule,
  MatDialogModule, MatStepperModule, MatRadioModule,
  MatSelect, MatSelectModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';

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
