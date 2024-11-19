import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiasResultComponent } from './aias-result.component';

describe('AiasResultComponent', () => {
  let component: AiasResultComponent;
  let fixture: ComponentFixture<AiasResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AiasResultComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiasResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
