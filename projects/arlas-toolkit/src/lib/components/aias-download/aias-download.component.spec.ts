import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiasDownloadComponent } from './aias-download.component';

describe('ProcessComponent', () => {
  let component: AiasDownloadComponent;
  let fixture: ComponentFixture<AiasDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AiasDownloadComponent]
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
