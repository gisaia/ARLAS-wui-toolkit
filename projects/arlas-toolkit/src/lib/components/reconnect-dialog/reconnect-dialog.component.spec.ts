import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { DateTimeProvider, OAuthLogger, OAuthModule, OAuthService, UrlHelperService } from 'angular-oauth2-oidc';
import { AuthentificationService } from '../../services/authentification/authentification.service';
import { GET_OPTIONS } from '../../tools/utils';
import { ReconnectDialogComponent } from './reconnect-dialog.component';

describe('ReconnectDialogComponent', () => {
  let component: ReconnectDialogComponent;
  let fixture: ComponentFixture<ReconnectDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ReconnectDialogComponent],
      imports: [
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
        }),
        MatDialogModule,
        OAuthModule.forRoot()
      ],
      providers: [
        AuthentificationService,
        OAuthService,
        OAuthLogger,
        DateTimeProvider,
        UrlHelperService,
        {
          provide: MAT_DIALOG_DATA,
          useValue: {}
        },
        {
          provide: GET_OPTIONS,
          useValue: () => {}
        },
        provideHttpClient(withInterceptorsFromDi())
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReconnectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
