import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrormodalComponent } from './errormodal.component';

describe('ErrormodalComponent', () => {
  let component: ErrormodalComponent;
  let fixture: ComponentFixture<ErrormodalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrormodalComponent ]
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
