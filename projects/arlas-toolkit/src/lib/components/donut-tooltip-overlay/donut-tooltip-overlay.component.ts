
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
import { ArlasOverlayRef, DONUT_TOOLTIP_DATA } from '../../tools/utils';
import { ARLASDonutTooltip } from 'arlas-d3';
import { NgFor } from '@angular/common';
import { FormatNumberModule } from 'arlas-web-components';

@Component({
    selector: 'arlas-donut-tooltip-overlay',
    templateUrl: './donut-tooltip-overlay.component.html',
    styleUrls: ['./donut-tooltip-overlay.component.css'],
    standalone: true,
    imports: [NgFor, FormatNumberModule]
})
export class DonutTooltipOverlayComponent {

  public constructor(public overlayRef: ArlasOverlayRef, @Inject(DONUT_TOOLTIP_DATA) public tooltip: ARLASDonutTooltip) {}

}
