import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateLoader, TranslateModule, TranslateNoOpLoader } from '@ngx-translate/core';
import { of } from 'rxjs';
import { ArlasIamService } from '../../services/arlas-iam/arlas-iam.service';
import { ArlasSettingsService } from '../../services/settings/arlas.settings.service';
import { MockArlasSettingsService } from '../../tools/tests/arlas-settings-service.mock';
import { LoginComponent } from './login.component';

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
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateNoOpLoader } }),
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
