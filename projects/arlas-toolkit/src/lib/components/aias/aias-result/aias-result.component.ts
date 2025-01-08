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

import { Component, Input, OnInit } from '@angular/core';
import { ProcessOutput } from '../../../tools/process.interface';
import { NgIf, DatePipe } from '@angular/common';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatButton } from '@angular/material/button';
import { MatDialogClose } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'arlas-aias-result',
    templateUrl: './aias-result.component.html',
    styleUrls: ['./aias-result.component.scss'],
    standalone: true,
    imports: [NgIf, MatProgressBar, MatButton, MatDialogClose, DatePipe, TranslateModule]
})
export class AiasResultComponent implements OnInit {

  @Input() public isProcessing = false;

  @Input() public statusResult: ProcessOutput;

  @Input() public hasError = false;

  @Input() public processName = '';

  @Input() public processAction = '';

  public constructor() { }

  public ngOnInit(): void {
  }

}
