import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { DeniedAccessDialogComponent } from './denied-access-dialog.component';

describe('ReconnectDialogComponent', () => {
  let component: DeniedAccessDialogComponent;
  let fixture: ComponentFixture<DeniedAccessDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DeniedAccessDialogComponent],
      imports: [TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateFakeLoader } }),
        MatDialogModule],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {}
        },
        provideHttpClient(withInterceptorsFromDi()),
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
