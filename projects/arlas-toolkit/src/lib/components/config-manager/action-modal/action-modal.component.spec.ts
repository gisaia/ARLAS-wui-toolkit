import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateLoader, TranslateModule, TranslateNoOpLoader } from '@ngx-translate/core';
import { DateTimeProvider, OAuthLogger, OAuthService, UrlHelperService } from 'angular-oauth2-oidc';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthentificationService } from '../../../services/authentification/authentification.service';
import { ArlasSettingsService } from '../../../services/settings/arlas.settings.service';
import { MockArlasSettingsService } from '../../../tools/tests/arlas-settings-service.mock';
import { GET_OPTIONS } from '../../../tools/utils';
import { ActionModalComponent } from './action-modal.component';

describe('ActionModalComponent', () => {
    let component: ActionModalComponent;
    let fixture: ComponentFixture<ActionModalComponent>;

    beforeEach(() => {
        const mockDialogRef = {
            close: vi.fn()
        };

        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateNoOpLoader } }),
                ActionModalComponent],
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
                    provide: MatDialogRef,
                    useValue: mockDialogRef
                },
                {
                    provide: GET_OPTIONS,
                    useValue: () => { }
                },
                provideHttpClient(withInterceptorsFromDi()),
                {
                    provide: ArlasSettingsService,
                    useClass: MockArlasSettingsService
                }
            ]
        })
        .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ActionModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
