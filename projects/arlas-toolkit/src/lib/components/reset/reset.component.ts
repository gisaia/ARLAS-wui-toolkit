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

import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ArlasIamService } from '../../services/arlas-iam/arlas-iam.service';
import { ConfirmedValidator } from '../../tools/utils';

@Component({
    selector: 'arlas-tool-reset',
    templateUrl: './reset.component.html',
    styleUrls: ['./reset.component.scss'],
    imports: [FormsModule, ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatButton, RouterLink, TranslatePipe]
})
export class ResetComponent {

  // TODO: check that it keeps working
  public resetForm = new FormGroup({
    password: new FormControl('', [Validators.required]),
    confirm_password: new FormControl('', [Validators.required])
  }, ConfirmedValidator('password', 'confirm_password') as ValidatorFn);
  public validated = false;

  public userId: string | null = null;
  public token: string | null = null;

  public constructor(
    private readonly iamService: ArlasIamService,
    private readonly route: ActivatedRoute,
  ) {
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('id');
      this.token = params.get('token');
    });
  }

  public onSubmit(): void {
    if (this.userId && this.token) {
      this.validated = false;
      this.iamService.reset(this.userId, this.token, this.resetForm.value.password as string).subscribe({
        next: (data) => {
          this.validated = true;
        },
        error: err => {
          console.error(err);
        }
      });
    }
  }
}
