import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';

import { ForgotComponent } from './forgot.component';

describe('ForgotComponent', () => {
  let component: ForgotComponent;
  let fixture: ComponentFixture<ForgotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ForgotComponent],
      providers: [FormBuilder],
      imports: [
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateFakeLoader } }),
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
