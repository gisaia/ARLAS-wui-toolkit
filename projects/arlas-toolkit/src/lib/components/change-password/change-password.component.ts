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

import { CdkScrollable } from '@angular/cdk/scrolling';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';
import { ArlasIamService } from '../../services/arlas-iam/arlas-iam.service';
import { ConfirmedValidator } from '../../tools/utils';

@Component({
  selector: 'arlas-tool-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: [
    './change-password.component.scss',
    '../iam/form-style.scss'
  ],
  imports: [
    MatDialogTitle, CdkScrollable, MatDialogContent, FormsModule, ReactiveFormsModule,
    MatFormField, MatLabel, MatInput, MatError, MatButton, MatDialogClose, TranslatePipe, MatDialogActions
]
})
export class ChangePasswordComponent {

  public changeForm = new FormGroup({
    old_password: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    confirm_password: new FormControl('', [Validators.required])
  }, ConfirmedValidator('password', 'confirm_password') as ValidatorFn);

  public validated = false;
  public displayForm = true;

  public constructor(
    private readonly iamService: ArlasIamService,
  ) { }

  public submit(): void {
    this.validated = false;
    this.iamService.change(this.changeForm.value.old_password as string, this.changeForm.value.password as string).subscribe({
      next: () => {
        this.validated = true;
        this.changeForm.reset();
        this.displayForm = false;
      },
      error: err => {
        this.changeForm.setErrors({
          wrong: true
        });
        console.error(err);
      }
    });
  }

}
