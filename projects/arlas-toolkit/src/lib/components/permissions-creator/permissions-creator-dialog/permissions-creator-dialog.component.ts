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

import { JsonPipe } from '@angular/common';
import { Component, DestroyRef, inject, Inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { marker } from '@colsen1991/ngx-translate-extract-marker';
import { TranslatePipe } from '@ngx-translate/core';
import { PermissionData, PermissionDef } from 'arlas-iam-api';
import { GetCollectionDisplayNamePipe } from 'arlas-web-components';
import { finalize } from 'rxjs';
import { ArlasIamService } from '../../../services/arlas-iam/arlas-iam.service';
import { ArlasSettingsService } from '../../../services/settings/arlas.settings.service';
import { PermissionDialogData } from '../_interfaces';

@Component({
  templateUrl: './permissions-creator-dialog.component.html',
  styleUrls: ['./permissions-creator-dialog.component.scss'],
  imports: [
    MatDialogModule,
    TranslatePipe,
    MatProgressSpinner,
    JsonPipe,
    MatIconModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    GetCollectionDisplayNamePipe,
    MatButtonModule,
    MatInputModule
  ]
})
export class PermissionsCreatorDialogComponent {

  public createPermissionForm = new FormGroup({
    description: new FormControl<string>('', [Validators.required])
  });

  public CREATE_TEXT: string = marker('Create the permission');
  public CLOSE_TEXT = marker('Close');

  public descriptionInputDisabled = false;
  public descriptionInputHidden = false;

  public creationButtonDisabled = false;
  public creationButtonHidden = false;

  public creationStatus: 'successful' | 'errored';
  public creationError;

  public showErrorDetails = false;
  public showSpinner = false;
  public showAction = true;

  private readonly destroyRef = inject(DestroyRef);

  public constructor(
    private readonly iamService: ArlasIamService,
    @Inject(MAT_DIALOG_DATA) public data: PermissionDialogData,
    private readonly settingsService: ArlasSettingsService
  ) { }

  public createPermission() {
    this.CREATE_TEXT = marker('Creating');
    this.showSpinner = true;
    this.creationButtonDisabled = true;
    this.descriptionInputDisabled = false;
    const permissionDef: PermissionDef = {
      value: this.data.partitionFilterHeader,
      description: this.createPermissionForm.value.description
    };
    this.iamService.createPermission(this.data.oid, permissionDef).pipe(
      finalize(() => {
        this.showSpinner = false;
        this.creationButtonDisabled = false;
        this.creationButtonHidden = true;
        this.descriptionInputHidden = true;
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (permissionData: PermissionData) => {
        this.creationStatus = 'successful';
        this.showAction = !!this.settingsService.getArlasIAMWuiUrl();
      },
      error: (err: any) => {
        this.creationStatus = 'errored';
        this.creationError = err;
        console.log(err);
      }
    });
  }

  public goToArlasIAMWui() {
    const iamUrl = this.settingsService.getArlasIAMWuiUrl();
    if (!!iamUrl) {
      window.open(iamUrl);
    }
  }

}
