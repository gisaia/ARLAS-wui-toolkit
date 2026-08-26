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
import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { marker } from '@colsen1991/ngx-translate-extract-marker';
import { MarkerModule } from '@colsen1991/ngx-translate-extract-marker/extras';
import { TranslatePipe } from '@ngx-translate/core';
import { Expression } from 'arlas-tagger-api';
import { ProcessService } from '../../../services/process/process.service';
import { ThemeService } from '../../../services/theme.service';
import { ConditionalValue, ProcessInputs } from '../../../tools/process.interface';
import { AiasEnrichDialogData, AiasProcess } from '../aias-process';
import { AiasResultComponent } from '../aias-result/aias-result.component';

export const ENRICH_PROCESS_NAME = marker('enrich');

export const COG_ENRICHMENT = marker('cog');

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
    MatDialogModule,
    MatChipsModule
  ]
})
export class AiasEnrichComponent extends AiasProcess implements OnInit {

  public enrichments: string[] = [
    COG_ENRICHMENT
  ];

  public availableCogFormats = new Array<{ label: string; value: string; }>();

  public formGroup = new FormGroup({
    asset_type: new FormControl<string>(this.enrichments[0], Validators.required),
    enrichments: new FormControl<string[]>([], Validators.required)
  });

  protected readonly themeService = inject(ThemeService);

  public constructor(
    protected processService: ProcessService,
    @Inject(MAT_DIALOG_DATA) protected data: AiasEnrichDialogData
  ) {
    super(processService, data, ENRICH_PROCESS_NAME);
  }

  public ngOnInit(): void {
    const processConfigFileInput = this.processService.getProcessInputs(ENRICH_PROCESS_NAME);
    this._initEnrichmentsList(processConfigFileInput);
  }

  private _initEnrichmentsList(inputs: ProcessInputs | undefined): void {
    const inputKey = 'enrichments';
    if (inputs?.[inputKey]) {
      const availableEnrichments = <ConditionalValue[]>inputs[inputKey].schema.enum;
      for (const e of availableEnrichments) {
        if (!e.if) {
          this.availableCogFormats.push(e);
        } else {
          let isValid = true;
          for (const condition of e.if) {
            const value = this.data.itemDetail.get(condition.field)?.toUpperCase();
            switch (condition.op) {
              case Expression.OpEnum.Like:
                isValid = isValid && (condition.value as any as string[]).includes(value);
                break;
              default:
                break;
            }
          }

          if (isValid) {
            this.availableCogFormats.push(e);
          }
        }
      }
    }
  }

  protected preparePayload() {
    return this.formGroup.value;
  }
}
