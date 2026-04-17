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
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { marker } from '@colsen1991/ngx-translate-extract-marker';
import { MarkerModule } from '@colsen1991/ngx-translate-extract-marker/extras';
import { TranslatePipe } from '@ngx-translate/core';
import { ProcessService } from '../../../services/process/process.service';
import { AiasEnrichDialogData, AiasProcess } from '../aias-process';
import { AiasResultComponent } from '../aias-result/aias-result.component';

export const ENRICH_PROCESS_NAME = marker('enrich');

@Component({
  selector: 'arlas-aias-enrich',
  templateUrl: './aias-enrich.component.html',
  styleUrls: ['./aias-enrich.component.scss', '../aias-process.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
  }],
  imports: [
    TranslatePipe,
    MatStepperModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule,
    MarkerModule,
    MatIconModule,
    AiasResultComponent,
    MatDialogModule
  ]
})
export class AiasEnrichComponent extends AiasProcess implements OnInit {

  public enrichments: Array<string> = [
    marker('cog')
  ];

  public formGroup = new FormGroup({
    asset_type: new FormControl<string>(this.enrichments[0])
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
        this.enrichments = [marker('cog')];
      }
    }
  }

  protected preparePayload() {
    return this.formGroup.value;
  }
}
