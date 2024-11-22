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

import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { ProcessService } from '../../../services/process/process.service';
import { AiasEnrichDialogData, AiasProcess } from '../aias-process';

export const ENRICH_PROCESS_NAME = 'enrich';

@Component({
  selector: 'arlas-aias-enrich',
  templateUrl: './aias-enrich.component.html',
  styleUrls: ['./aias-enrich.component.scss', '../aias-process.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
  }]
})
export class AiasEnrichComponent extends AiasProcess implements OnInit {

  public enrichments: Array<string> = [
    marker('Cog')
  ];

  public formGroup = new FormGroup({
    process: new FormControl<string>(this.enrichments[0])
  });

  public constructor(
    protected processService: ProcessService,
    @Inject(MAT_DIALOG_DATA) protected data: AiasEnrichDialogData
  ) {
    super(processService, data, ENRICH_PROCESS_NAME);
  }

  public ngOnInit(): void {
    this._initEnrichmentsList();
  }

  private _initEnrichmentsList(): void {
    const itemFormatKey = 'properties.item_format';
    const itemFormatIsValid = this.data.itemDetail && this.data.itemDetail.has(itemFormatKey)
      && !!this.data.itemDetail.get(itemFormatKey);
    if (itemFormatIsValid) {
      const itemFormat = this.data.itemDetail.get(itemFormatKey).toUpperCase();
      if (itemFormat === 'SAFE') {
        this.enrichments = [marker('Cog')];
      }
    }
  }

  protected preparePayload() {
    return this.formGroup.value;
  }
}
