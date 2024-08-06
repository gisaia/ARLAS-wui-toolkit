import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopMenuComponent } from './top-menu.component';
import { AuthentificationService } from '../../services/authentification/authentification.service';
import { DateTimeProvider, OAuthLogger, OAuthService, UrlHelperService } from 'angular-oauth2-oidc';
import { HttpClientModule } from '@angular/common/http';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MatLegacyDialogModule as MatDialogModule, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { ArlasSettingsService } from '../../services/settings/arlas.settings.service';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';

describe('TopMenuComponent', () => {
  let component: TopMenuComponent;
  let fixture: ComponentFixture<TopMenuComponent>;

  beforeEach(async () => {
    const mockDialogRef = {
      close: jasmine.createSpy('close')
    };
    await TestBed.configureTestingModule({
      declarations: [ TopMenuComponent ],
      imports: [
        HttpClientModule,
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateFakeLoader } }),
        MatDialogModule,
        MatMenuModule
      ],
      providers: [
        AuthentificationService,
        OAuthService,
        OAuthLogger,
        UrlHelperService,
        DateTimeProvider,
        {
          provide: MatDialogRef,
          useValue: mockDialogRef
        },
        ArlasSettingsService
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TopMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
