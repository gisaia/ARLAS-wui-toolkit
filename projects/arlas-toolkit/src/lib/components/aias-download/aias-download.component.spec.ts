import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiasDownloadComponent } from './aias-download.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('ProcessComponent', () => {
  let component: AiasDownloadComponent;
  let fixture: ComponentFixture<AiasDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AiasDownloadComponent],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            data : {
              nbProducts: 2,
              itemDetail: new Map(),
              wktAoi: null,
              ids: ['1', '2'],
              collection: 'test',
            }
          }
        }
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
