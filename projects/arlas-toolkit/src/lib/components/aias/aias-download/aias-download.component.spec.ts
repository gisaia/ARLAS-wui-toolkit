import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiasDownloadComponent } from './aias-download.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {
  ArlasCollaborativesearchService
} from '../../../services/collaborative-search/arlas.collaborative-search.service';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('AiasDownloadComponent', () => {
  let component: AiasDownloadComponent;
  let fixture: ComponentFixture<AiasDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideAnimations(),
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            data: {
              nbProducts: 2,
              itemDetail: new Map(),
              wktAoi: null,
              ids: ['1', '2'],
              collection: 'test',
            }
          }
        },
        provideHttpClient(withInterceptorsFromDi()),
        ArlasCollaborativesearchService
      ],
      imports: [
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
        }),
        AiasDownloadComponent,
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AiasDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
