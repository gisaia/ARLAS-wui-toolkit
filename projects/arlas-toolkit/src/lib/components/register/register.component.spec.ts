import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { RouterModule } from '@angular/router';
import { RegisterComponent } from './register.component';
import { ArlasSettingsService } from '../../services/settings/arlas.settings.service';
import { MockArlasSettingsService } from '../../tools/tests/arlas-settings-service.mock';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideAnimations(),
        FormBuilder,
        {
          provide: ArlasSettingsService,
          useClass: MockArlasSettingsService
        }
      ],
      imports: [
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateFakeLoader } }),
        RouterModule.forRoot([]),
        FormsModule,
        ReactiveFormsModule,
        RegisterComponent
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
