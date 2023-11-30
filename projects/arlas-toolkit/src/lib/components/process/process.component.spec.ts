import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessComponent } from './process.component';

describe('ProcessComponent', () => {
  let component: ProcessComponent;
  let fixture: ComponentFixture<ProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProcessComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
