import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmonitionCardComponent } from './admonition-card.component';

describe('AdmonitionCardComponent', () => {
  let component: AdmonitionCardComponent;
  let fixture: ComponentFixture<AdmonitionCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdmonitionCardComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AdmonitionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
