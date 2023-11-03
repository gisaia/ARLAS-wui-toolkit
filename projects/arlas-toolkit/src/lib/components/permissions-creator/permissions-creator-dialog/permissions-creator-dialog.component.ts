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

import { Component, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PermissionDialogData } from '../_interfaces';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ArlasIamService } from '../../../services/arlas-iam/arlas-iam.service';
import { PermissionData, PermissionDef } from 'arlas-iam-api';
import { Subscription, finalize } from 'rxjs';
import { ArlasSettingsService } from '../../../services/settings/arlas.settings.service';

@Component({
  templateUrl: './permissions-creator-dialog.component.html',
  styleUrls: ['./permissions-creator-dialog.component.scss']
})
export class PermissionsCreatorDialogComponent implements OnDestroy {

  public createPermissionForm: FormGroup;

  public CREATE_TEXT = 'Create the permission';
  public CLOSE_TEXT = 'Close';

  public descriptionInputDisabled = false;
  public descriptionInputHidden = false;

  public creationButtonDisabled = false;
  public creationButtonHidden = false;

  public creationStatus: 'successful' | 'errored';
  public creationError;

  public showErrorDetails = false;
  public showSpinner = false;
  public showAction = true;
  private subscription: Subscription;

  public constructor(
    private iamService: ArlasIamService,
    @Inject(MAT_DIALOG_DATA) public data: PermissionDialogData,
    private settingsService: ArlasSettingsService) {
    this.createPermissionForm = new FormGroup({
      description: new FormControl<string>('', [Validators.required])
    });
  }

  public createPermission() {
    this.CREATE_TEXT = 'Creating';
    this.showSpinner = true;
    this.creationButtonDisabled = true;
    this.descriptionInputDisabled = false;
    const permissionDef: PermissionDef = {
      value: this.data.partitionFilterHeader,
      description: this.createPermissionForm.get('description').value
    };
    this.subscription = this.iamService.createPermission(this.data.oid, permissionDef).pipe(
      finalize(() => {
        this.showSpinner = false;
        this.creationButtonDisabled = false;
        this.creationButtonHidden = true;
        this.descriptionInputHidden = true;
      })
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

  public ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public goToArlasIAMWui() {
    const iamUrl = this.settingsService.getArlasIAMWuiUrl();
    if (!!iamUrl) {
      window.open(iamUrl);
    }
  }

}
