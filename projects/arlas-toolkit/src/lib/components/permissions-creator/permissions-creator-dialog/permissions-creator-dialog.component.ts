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

import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PermissionDialogData } from '../_interfaces';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ArlasIamService } from '../../../services/arlas-iam/arlas-iam.service';
import { PermissionDef } from 'arlas-iam-api';

@Component({
  templateUrl: './permissions-creator-dialog.component.html',
  styleUrls: ['./permissions-creator-dialog.component.scss']
})
export class PermissionsCreatorDialogComponent {

  public createPermissionForm: FormGroup;

  public constructor(
    private iamService: ArlasIamService,
    private dialogRef: MatDialogRef<PermissionsCreatorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: PermissionDialogData) {

    this.createPermissionForm = new FormGroup({
      description: new FormControl<string>('', [Validators.required])
    });
  }

  public createPermission() {
    const permissionDef: PermissionDef = {
      value: this.data.partitionFilterHeader,
      description: this.createPermissionForm.get('description').value
    };
    this.iamService.createPermission(this.data.oid, permissionDef);
  }

}
