import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateLoader, TranslateModule, TranslateNoOpLoader } from '@ngx-translate/core';
import { OAuthModule } from 'angular-oauth2-oidc';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DeniedAccessDialogComponent } from './denied-access-dialog.component';

describe('DeniedAccessDialogComponent', () => {
    let component: DeniedAccessDialogComponent;
    let fixture: ComponentFixture<DeniedAccessDialogComponent>;

    beforeEach(() => {
        const mockDialogRef = {
            close: vi.fn()
        };

        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: TranslateNoOpLoader }
                }),
                OAuthModule.forRoot(),
                DeniedAccessDialogComponent
            ],
            providers: [
                {
                    provide: MAT_DIALOG_DATA,
                    useValue: {
                        error: {
                            actionSeeker$: of()
                        }
                    }
                },
                provideHttpClient(withInterceptorsFromDi()),
                {
                    provide: MatDialogRef,
                    useValue: mockDialogRef
                },
            ]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DeniedAccessDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
