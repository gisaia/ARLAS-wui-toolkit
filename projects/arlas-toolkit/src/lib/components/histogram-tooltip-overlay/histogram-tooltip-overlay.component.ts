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

import { Component, Inject } from '@angular/core';
import { ArlasOverlayRef, HISTOGRAM_TOOLTIP_DATA } from '../../tools/utils';
import { HistogramTooltip, GetCollectionUnitModule } from 'arlas-web-components';
import { NgTemplateOutlet, NgIf, NgFor } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'arlas-histogram-tooltip-overlay',
  templateUrl: './histogram-tooltip-overlay.component.html',
  styleUrls: ['./histogram-tooltip-overlay.component.scss'],
  standalone: true,
  imports: [NgTemplateOutlet, NgIf, NgFor, TranslateModule, GetCollectionUnitModule]
})
export class HistogramTooltipOverlayComponent {
  public interval: {
    start: Date | number | string;
    end?: Date | number;
  };

  public displayText = true;

  public constructor(
    public overlayRef: ArlasOverlayRef,
    @Inject(HISTOGRAM_TOOLTIP_DATA) public tooltip: HistogramTooltip
  ) {
    this.calculateDate();
  }

  public calculateDate() {
    const start = this.tooltip.xStartValue;
    let end;
    if (this.tooltip.xEndValue !== null && this.tooltip.xEndValue !== undefined) {
      end = this.tooltip.xEndValue;
    }
    this.interval = {
      start,
      end
    };

    this.displayText = this.interval.end !== null && this.interval.end !== undefined &&
      this.interval.start !== null && this.interval.start !== undefined;
  }
}
