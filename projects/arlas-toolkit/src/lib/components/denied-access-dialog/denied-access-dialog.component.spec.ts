import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateLoader, TranslateModule, TranslateNoOpLoader } from '@ngx-translate/core';
import { OAuthModule } from 'angular-oauth2-oidc';
import { of } from 'rxjs';
import { DeniedAccessDialogComponent } from './denied-access-dialog.component';

describe('DeniedAccessDialogComponent', () => {
  let component: DeniedAccessDialogComponent;
  let fixture: ComponentFixture<DeniedAccessDialogComponent>;

  beforeEach(waitForAsync(() => {
    const mockDialogRef = {
      close: jasmine.createSpy('close')
    };

    TestBed.configureTestingModule({
    imports: [
        TranslateModule.forRoot({
            loader: { provide: TranslateLoader, useClass: TranslateNoOpLoader }
        }),
        MatDialogModule,
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
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeniedAccessDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
