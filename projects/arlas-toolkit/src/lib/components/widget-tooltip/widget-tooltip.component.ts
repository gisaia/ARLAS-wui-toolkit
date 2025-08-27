import { Component, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

export interface WidgetTooltip<T> {
  title: string;
  dataType: 'numeric' | 'date' | 'keyword';
  shown: boolean;
  xPosition: number;
  yPosition: number;
  data: T;
}

@Component({
  selector: 'arlas-widget-tooltip',
  standalone: true,
  imports: [
    TranslateModule
  ],
  templateUrl: './widget-tooltip.component.html',
  styleUrl: './widget-tooltip.component.scss'
})
export class WidgetTooltipComponent {
  public title = input.required<string>();

  /** Whether to hide the box-shadow */
  public isFlat = input<boolean>(false);
}
