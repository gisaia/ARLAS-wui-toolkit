import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrormodalComponent } from './errormodal.component';
import { MatDialogModule } from '@angular/material';
import { ErrorService } from 'app/services/error/error.service';

describe('ErrormodalComponent', () => {
  let component: ErrormodalComponent;
  let fixture: ComponentFixture<ErrormodalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ErrormodalComponent],
      providers: [
        ErrorService
      ],
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
