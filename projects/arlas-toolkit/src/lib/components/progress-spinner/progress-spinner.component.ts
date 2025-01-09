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

import { Component, OnInit, Input } from '@angular/core';
import { SpinnerOptions } from '../../tools/utils';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

export const DEFAULT_SPINNER_OPTIONS: SpinnerOptions = {
  color: 'primary',
  diameter: 100,
  strokeWidth: 5
};

@Component({
  selector: 'arlas-tool-progress-spinner',
  templateUrl: './progress-spinner.component.html',
  styleUrls: ['./progress-spinner.component.css'],
  standalone: true,
  imports: [MatProgressSpinner]
})
export class ProgressSpinnerComponent implements OnInit {

  @Input() public color = DEFAULT_SPINNER_OPTIONS.color;
  @Input() public diameter = DEFAULT_SPINNER_OPTIONS.diameter;
  @Input() public strokeWidth = DEFAULT_SPINNER_OPTIONS.strokeWidth;

  public constructor() { }

  public ngOnInit(): void {
  }

}
