import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateLoader, TranslateModule, TranslateNoOpLoader } from '@ngx-translate/core';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ArlasIamService } from '../../services/arlas-iam/arlas-iam.service';
import { ArlasSettingsService } from '../../services/settings/arlas.settings.service';
import { MockArlasSettingsService } from '../../tools/tests/arlas-settings-service.mock';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;

    beforeEach(async () => {
        const mockIamService = {
            refresh: vi.fn(() => of({})).mockName('ArlasIamService.refresh'),
            setHeadersFromAccesstoken: vi.fn().mockName('ArlasIamService.setHeadersFromAccesstoken'),
            notifyTokenRefresh: vi.fn().mockName('ArlasIamService.notifyTokenRefresh')
        };

        await TestBed.configureTestingModule({
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
                RouterModule.forRoot([]),
                LoginComponent
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
