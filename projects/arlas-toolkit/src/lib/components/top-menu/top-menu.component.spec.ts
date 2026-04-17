import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateLoader, TranslateModule, TranslateNoOpLoader } from '@ngx-translate/core';
import { DateTimeProvider, OAuthLogger, OAuthService, UrlHelperService } from 'angular-oauth2-oidc';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthentificationService } from '../../services/authentification/authentification.service';
import { ArlasSettingsService } from '../../services/settings/arlas.settings.service';
import { TopMenuComponent } from './top-menu.component';

describe('TopMenuComponent', () => {
    let component: TopMenuComponent;
    let fixture: ComponentFixture<TopMenuComponent>;

    beforeEach(async () => {
        const mockDialogRef = {
            close: vi.fn()
        };
        await TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateNoOpLoader } }),
                TopMenuComponent
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
