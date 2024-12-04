import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiasEnrichComponent } from './aias-enrich.component';

describe('AiasEnrichComponent', () => {
  let component: AiasEnrichComponent;
  let fixture: ComponentFixture<AiasEnrichComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AiasEnrichComponent ]
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
