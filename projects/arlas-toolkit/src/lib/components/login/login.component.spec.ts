import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ArlasSettingsService } from '../../services/settings/arlas.settings.service';
import { LoginComponent } from './login.component';
import { of } from 'rxjs';
import { ArlasIamService } from '../../services/arlas-iam/arlas-iam.service';
import { MockArlasSettingsService } from '../../tools/tests/arlas-settings-service.mock';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    const mockIamService = jasmine.createSpyObj('ArlasIamService', ['refresh', 'setHeadersFromAccesstoken', 'notifyTokenRefresh']);
    mockIamService.refresh.and.returnValue(of({}));
    mockIamService.setHeadersFromAccesstoken.and.returnValue();
    mockIamService.notifyTokenRefresh.and.returnValue();

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        FormBuilder,
        {
          provide: ArlasSettingsService,
          useClass: MockArlasSettingsService
        },
        {
          provide: ArlasIamService,
          useValue: mockIamService
        }
      ],
      imports: [
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateFakeLoader } }),
        RouterModule.forRoot([])
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
