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

import { DatePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslateModule } from '@ngx-translate/core';
import { ProcessOutput, ProcessStatus } from '../../../tools/process.interface';
import { DeltaTimePipe } from 'arlas-web-components';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'arlas-aias-result',
  templateUrl: './aias-result.component.html',
  styleUrls: ['./aias-result.component.scss', '../aias-process.scss'],
  imports: [
    TranslateModule,
    DatePipe,
    MatProgressBarModule,
    MatDialogModule,
    MatButtonModule,
    DeltaTimePipe,
    MatTooltip
  ]
})
export class AiasResultComponent {

  public isProcessing = input(false);

  public statusResult = input<ProcessOutput | null >(null);

  public hasError = input(false);

  public processName = input('');

  public processAction = input('');
  // Whether to display or not json message
  protected displayMessage =  computed(() =>  this.intermediateState() || this.hasError()
    || this.statusResult()?.status === ProcessStatus.failed);
  // Calculate duration
  protected duration =  computed(() => {
    const createdDateMillis =  this.statusResult()?.created ?? 0;
    const endDateMillis = this.statusResult()?.finished ?? 0;
    return this.intermediateState() ? Date.now() - createdDateMillis : endDateMillis - createdDateMillis;
  });
  // Check in witch state we are to know what we show
  protected intermediateState = computed(() =>
    this.statusResult()?.status === ProcessStatus.running ||
    this.statusResult()?.status === ProcessStatus.accepted || this.statusResult()?.status === ProcessStatus.dismissed);
}
