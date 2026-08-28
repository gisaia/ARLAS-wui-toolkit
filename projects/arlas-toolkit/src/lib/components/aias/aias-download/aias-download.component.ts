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
import { Component, inject, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTooltipModule } from '@angular/material/tooltip';
import { marker } from '@colsen1991/ngx-translate-extract-marker';
import { MarkerModule } from '@colsen1991/ngx-translate-extract-marker/extras';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { ProcessService } from '../../../services/process/process.service';
import { ThemeService } from '../../../services/theme.service';
import { AiasDownloadDialogData, AiasProcess } from '../aias-process';
import { AiasResultComponent } from '../aias-result/aias-result.component';

export const DOWNLOAD_PROCESS_NAME = marker('download');

export interface AiasDownloadPayload {
  raw_archive: boolean | null | undefined;
  target_format: string | null | undefined;
  target_projection: string | null | undefined;
  crop_wkt: string | null | undefined;
}

@Component({
  selector: 'arlas-aias-download',
  templateUrl: './aias-download.component.html',
  styleUrls: ['./aias-download.component.scss', '../aias-process.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false }
    }
  ],
  imports: [
    TranslatePipe,
    MatStepperModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    TranslateDirective,
    ReactiveFormsModule,
    MarkerModule,
    AiasResultComponent,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    MatProgressBarModule,
    MatSlideToggleModule
  ]
})
export class AiasDownloadComponent extends AiasProcess implements OnInit, OnDestroy {

  public formGroup = new FormGroup({
    raw_archive: new FormControl<boolean>(true),
    do_crop_wkt: new FormControl<boolean>(false),
    target_projection: new FormControl<string>(marker('native')),
    target_format: new FormControl<string>('native')
  });

  public hasAoi = false;
  public displayAoiForms = false;
  public displayFormatForm = false;
  public displayProjectionFrom = false;

  public tooltipDelay = 2000;

  private readonly _onDestroy$ = new Subject();
  protected readonly themeService = inject(ThemeService);

  public constructor(
    protected readonly processService: ProcessService,
    @Inject(MAT_DIALOG_DATA) protected data: AiasDownloadDialogData
  ) {
    super(processService, data, DOWNLOAD_PROCESS_NAME);
  }

  public ngOnInit(): void {
    this.hasAoi = this.data.wktAoi !== undefined && this.data.wktAoi !== null && this.data.wktAoi !== '';
    this._listenFormsChanges();
  }

  public ngOnDestroy(): void {
    if (!!this.statusSub) {
      this.statusSub.unsubscribe();
    }
    this._onDestroy$.next(true);
    this._onDestroy$.complete();
  }

  private _listenFormsChanges(): void {
    this.formGroup.controls.raw_archive
      .valueChanges
      .pipe(takeUntil(this._onDestroy$))
      .subscribe(checked => {
        this.formGroup.controls.do_crop_wkt.setValue(false);
        this.updateFormDisplayConditions();
        if (checked) {
          this.formGroup.controls.target_format.setValue('native');
          this.formGroup.controls.target_projection.setValue('native');
        }
      });

    this.formGroup.controls.do_crop_wkt
      .valueChanges
      .pipe(takeUntil(this._onDestroy$))
      .subscribe(checked => {
        this.updateFormDisplayConditions();
        if (checked) {
          this.formGroup.controls.target_projection.setValue('native');
        }
      });
  }

  private hasOneItemToDownload(): boolean {
    return this.data.nbProducts === 1;
  }

  private downloadAllElements(): boolean {
    return !!this.formGroup.value.raw_archive;
  }

  private updateFormDisplayConditions() {
    this.displayAoiForms = !this.downloadAllElements() && this.hasAoi;
    this.displayFormatForm = !this.downloadAllElements() && this.hasOneItemToDownload();
    this.displayProjectionFrom =  !this.downloadAllElements() && !this.formGroup.controls.do_crop_wkt.value &&  this.hasOneItemToDownload();
  }

  protected preparePayload() {
    const payload: AiasDownloadPayload = {
      raw_archive: this.formGroup.value.raw_archive,
      target_format: this.formGroup.value.target_format,
      target_projection: this.formGroup.value.target_projection,
      crop_wkt: null
    };

    if (this.formGroup.value.do_crop_wkt === true && this.hasAoi) {
      payload.crop_wkt = this.data.wktAoi;
    }

    return payload;
  }
}
