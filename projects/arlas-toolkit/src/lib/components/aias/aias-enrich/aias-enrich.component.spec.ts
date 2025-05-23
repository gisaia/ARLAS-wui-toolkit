import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArlasCollaborativesearchService } from '../../../services/collaborative-search/arlas.collaborative-search.service';
import { AiasEnrichComponent } from './aias-enrich.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';

describe('AiasEnrichComponent', () => {
  let component: AiasEnrichComponent;
  let fixture: ComponentFixture<AiasEnrichComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AiasEnrichComponent ],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        ArlasCollaborativesearchService,
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            data : {
              nbProducts: 2,
              itemDetail: new Map(),
              ids: ['1', '2'],
              collection: 'test',
            }
          }
        }
      ],
      imports: [
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
        }),
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AiasEnrichComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
