import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateLoader, TranslateModule, TranslateNoOpLoader } from '@ngx-translate/core';
import { DateTimeProvider, OAuthLogger, OAuthService, UrlHelperService } from 'angular-oauth2-oidc';
import { AuthentificationService } from '../../services/authentification/authentification.service';
import { ArlasSettingsService } from '../../services/settings/arlas.settings.service';
import { TopMenuComponent } from './top-menu.component';

describe('TopMenuComponent', () => {
  let component: TopMenuComponent;
  let fixture: ComponentFixture<TopMenuComponent>;

  beforeEach(async () => {
    const mockDialogRef = {
      close: jasmine.createSpy('close')
    };
    await TestBed.configureTestingModule({
      declarations: [TopMenuComponent],
      imports: [TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateNoOpLoader } }),
        MatDialogModule,
        MatMenuModule],
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
        ArlasSettingsService,
        provideHttpClient(withInterceptorsFromDi())
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
