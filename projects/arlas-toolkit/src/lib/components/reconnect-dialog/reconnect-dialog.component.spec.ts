import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';

import { ReconnectDialogComponent } from './reconnect-dialog.component';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GET_OPTIONS } from '../../tools/utils';
import { AuthentificationService } from '../../services/authentification/authentification.service';
import { getOptionsFactory } from '../../toolkit.module';
import { OAuthService, OAuthModule, OAuthLogger, UrlHelperService, DateTimeProvider } from 'angular-oauth2-oidc';
import { HttpClientModule } from '@angular/common/http';

describe('ReconnectDialogComponent', () => {
  let component: ReconnectDialogComponent;
  let fixture: ComponentFixture<ReconnectDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReconnectDialogComponent],
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
          useFactory: getOptionsFactory,
          deps: [AuthentificationService]
        }
      ],
      imports: [
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateFakeLoader } }),
        MatDialogModule,
        OAuthModule,
        HttpClientModule]
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
