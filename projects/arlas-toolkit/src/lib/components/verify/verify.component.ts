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

import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ArlasIamService } from '../../services/arlas-iam/arlas-iam.service';
import { ArlasSettingsService } from '../../services/settings/arlas.settings.service';
import { ConfirmedValidator, NOT_CONFIGURED } from '../../tools/utils';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'arlas-verify',
  templateUrl: './verify.component.html',
  styleUrls: [
    './verify.component.scss',
    '../iam/form-style.scss'
  ],
  imports: [FormsModule, ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatError, MatButton, RouterLink, TranslatePipe]
})
export class VerifyComponent {
  public validateForm = new FormGroup({
    password: new FormControl('', Validators.required),
    confirm_password: new FormControl('', Validators.required)
  }, ConfirmedValidator('password', 'confirm_password') as ValidatorFn);
  public validated = false;
  public displayForm = true;
  public userId: string | null = null;
  public token: string | null = null;
  private readonly theme = inject(ThemeService);

  public constructor(
    private readonly iamService: ArlasIamService,
    private readonly route: ActivatedRoute,
    private readonly settingsService: ArlasSettingsService
  ) {
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('id');
      this.token = params.get('token');
    });
    this.theme.applyThemePreference();
  }

  public onSubmit(formDirective: FormGroupDirective): void {
    if (!this.userId || !this.token || !this.validateForm.value.password) {
      return;
    }

    this.validated = false;
    this.iamService.verify(this.userId, this.token, this.validateForm.value.password).subscribe({
      next: (e) => {
        formDirective.resetForm();
        this.validateForm.reset();
        this.validated = true;
        const authSettings = this.settingsService.getAuthentSettings();
        this.displayForm = false;
        if (!!authSettings && authSettings.login_url && authSettings.login_url !== NOT_CONFIGURED) {
          window.open(authSettings.login_url, '_self');
        }
      },
      error: err => {
        err.json().then((e: any) => {
          if (e.message === 'User already verified.') {
            this.validateForm.setErrors({
              alreadyVerified: true
            });
          } else if (e.message === 'User not found.') {
            this.validateForm.setErrors({
              unknownUser: true
            });
          } else {
            this.validateForm.setErrors({
              serviceError: true
            });
          }
        });
      }
    });
  }
}
