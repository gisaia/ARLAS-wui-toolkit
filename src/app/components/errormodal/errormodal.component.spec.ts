import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrormodalComponent } from './errormodal.component';
import { ArlasCollaborativesearchService, ArlasConfigService } from '../../services/startup/startup.service';
import { MatDialogModule } from '@angular/material';

describe('ErrormodalComponent', () => {
  let component: ErrormodalComponent;
  let fixture: ComponentFixture<ErrormodalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ErrormodalComponent],
      providers: [ArlasCollaborativesearchService, ArlasConfigService],
      imports: [MatDialogModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrormodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
