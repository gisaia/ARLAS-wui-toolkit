import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WidgetTooltipComponent } from './widget-tooltip.component';

describe('WidgetTooltipComponent', () => {
  let component: WidgetTooltipComponent;
  let fixture: ComponentFixture<WidgetTooltipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetTooltipComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(WidgetTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
