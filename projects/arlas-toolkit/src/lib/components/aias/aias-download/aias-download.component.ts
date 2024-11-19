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
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import bboxPolygon from '@turf/bbox-polygon';
import booleanIntersects from '@turf/boolean-intersects';
import { Subject, takeUntil } from 'rxjs';
import { ProcessService } from '../../../services/process/process.service';
import { ProcessInputs, ProcessProjection } from '../../../tools/process.interface';
import { AiasDownloadDialogData, AiasProcess } from '../aias-process';

@Component({
  selector: 'arlas-aias-download',
  templateUrl: './aias-download.component.html',
  styleUrls: ['./aias-download.component.scss', '../aias-process.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
  }]
})
export class AiasDownloadComponent extends AiasProcess implements OnInit, OnDestroy {

  public formGroup: FormGroup = new FormGroup({
    raw_archive: new FormControl<boolean>(true),
    crop_wkt: new FormControl<boolean>(false),
    target_projection: new FormControl<string>(marker('native')),
    target_format: new FormControl<string>('native')
  });

  public pictureFormats: Array<string> = [
    marker('native'),
    marker('Geotiff'),
    marker('Jpeg2000')
  ];
  public projections: ProcessProjection[] = [];

  public hasAoi = false;
  public displayAoiForms = false;
  public displayFormatFrom = false;
  public displayProjectionFrom = false;

  public tooltipDelay = 2000;

  private _onDestroy$ = new Subject();

  public constructor(
    protected processService: ProcessService,
    @Inject(MAT_DIALOG_DATA) protected data: AiasDownloadDialogData
  ) {
    super(processService, data);
  }

  public ngOnInit(): void {
    if (this.data.nbProducts === 1){
      const processConfigFileInput = this.processService.getProcessInputs();
      this._initPictureFormatList();
      this._initProjectionList(processConfigFileInput);
    }
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

  private _initPictureFormatList(): void{
    const assetFormatKey = 'properties.main_asset_format';
    const assetFormatIsValid = this.data.itemDetail && this.data.itemDetail.has(assetFormatKey)
      && !!this.data.itemDetail.get(assetFormatKey);
    if (assetFormatIsValid) {
      const assetFormat = this.data.itemDetail.get(assetFormatKey).toUpperCase();
      if (assetFormat === 'JPEG2000') {
        this.pictureFormats = ['Jpeg2000'];
        this.formGroup.get('target_format').setValue('Jpeg2000');
      } else if (assetFormat === 'GEOTIFF') {
        this.pictureFormats = this.pictureFormats.filter(format => format.toUpperCase() !== 'GEOTIFF');
      }
    }

    const itemFormatKey = 'properties.item_format';
    const itemFormatIsValid = this.data.itemDetail && this.data.itemDetail.has(itemFormatKey)
      && !!this.data.itemDetail.get(itemFormatKey);
    if (itemFormatIsValid) {
      const itemFormat = this.data.itemDetail.get(itemFormatKey).toUpperCase();
      if (itemFormat === 'SAFE') {
        this.pictureFormats.push(marker('Zarr'));
      }
    }
  }

  private _initProjectionList(projection: ProcessInputs): void {
    const inputKey = 'target_projection';
    if (projection[inputKey]) {
      this.projections = (<ProcessProjection[]>projection[inputKey].schema.enum).filter(projection => {
        const geoJson = this.data.itemDetail.get('geometry');
        if(!projection.bbox || !geoJson) {
          return false;
        }
        const feature1 = bboxPolygon(projection.bbox);
        return booleanIntersects(feature1, geoJson);
      });
    }
    const native: ProcessProjection = {bbox: undefined, label: 'native', value: marker('native')};
    this.projections.unshift(native);
  }

  private _listenFormsChanges(): void{
    this.formGroup.get('raw_archive')
      .valueChanges
      .pipe(takeUntil(this._onDestroy$))
      .subscribe(checked => {
        this.displayAoiForms = !checked && this.hasAoi;
        this.displayFormatFrom = !checked &&  this.hasOneItemToDownload();
        this.displayProjectionFrom = !checked &&  this.hasOneItemToDownload();
        this.formGroup.get('crop_wkt').setValue(false);
        if(checked){
          this.formGroup.get('target_format').setValue('native');
          this.formGroup.get('target_projection').setValue('native');
        }
      });

    this.formGroup.get('crop_wkt')
      .valueChanges
      .pipe(takeUntil(this._onDestroy$))
      .subscribe(checked => {
        this.displayFormatFrom = !this.downloadAllElements() &&  this.hasOneItemToDownload();
        this.displayProjectionFrom =  !this.downloadAllElements() && !checked &&  this.hasOneItemToDownload();
        if(checked){
          this.formGroup.get('target_projection').setValue('native');
        }
      });
  }

  public hasOneItemToDownload(): boolean{
    return this.data.nbProducts === 1;
  }

  public downloadAllElements(): boolean {
    return this.formGroup.get('raw_archive').value;
  }

  protected preparePayload() {
    const payload = this.formGroup.value;
    payload['crop_wkt'] = '';
    if(this.formGroup.get('crop_wkt').value === true && this.hasAoi){
      payload['crop_wkt'] = this.data.wktAoi;
    }

    return payload;
  }
}
