/*
 * Licensed to Gisaïa under one or more contributor
 * license agreements. See the NOTICE.txt file distributed with
 * this work for additional information regarding copyright
 * ownership. Gisaïa licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

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
