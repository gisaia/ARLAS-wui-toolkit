
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

import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ARLASDonutTooltip } from 'arlas-d3';
import { FormatNumberModule } from 'arlas-web-components';
import { DONUT_TOOLTIP_DATA } from '../../tools/utils';
import { WidgetTooltipComponent } from '../widget-tooltip/widget-tooltip.component';

@Component({
  selector: 'arlas-donut-tooltip-overlay',
  templateUrl: './donut-tooltip-overlay.component.html',
  styleUrls: ['./donut-tooltip-overlay.component.scss'],
  standalone: true,
  imports: [
    TranslateModule,
    WidgetTooltipComponent,
    CommonModule,
    FormatNumberModule
  ]
})
export class DonutTooltipOverlayComponent {
  public tooltip = inject<ARLASDonutTooltip>(DONUT_TOOLTIP_DATA);

  /** Computes the style for the columns of the x and y values based on the number of data in the tooltip */
  protected valueStyle = (this.tooltip.content ?? []).map(c => '1fr').join(' ');
}
