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

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ArlasIamService } from '../../services/arlas-iam/arlas-iam.service';
import { ConfirmedValidator } from '../../tools/utils';
import { ArlasSettingsService } from '../../services/settings/arlas.settings.service';
import { NOT_CONFIGURED } from '../../tools/utils';

@Component({
  selector: 'arlas-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent implements OnInit {

  public validateForm: FormGroup;
  public validated = false;
  public displayForm = true;

  public userId = null;
  public token = null;

  public constructor(
    private formBuilder: FormBuilder,
    private iamService: ArlasIamService,
    private route: ActivatedRoute,
    private settingsService: ArlasSettingsService
  ) { }

  public ngOnInit(): void {
    this.validateForm = this.formBuilder.group({
      password: ['', [Validators.required]],
      confirm_password: ['', [Validators.required]]
    }, {
      validator: ConfirmedValidator('password', 'confirm_password')
    });

    this.route.paramMap.subscribe(params => {
      this.userId = params.get('id');
      this.token = params.get('token');
    });
  }

  public onSubmit(formDirective: FormGroupDirective): void {
    this.validated = false;
    this.iamService.verify(this.userId, this.token, this.validateForm.get('password').value).subscribe({
      next: (e) => {
        formDirective.resetForm();
        this.validateForm.reset();
        this.validated = true;
        const authSettings = this.settingsService.getAuthentSettings();
        this.displayForm  = false;
        if (!!authSettings && authSettings.login_url && authSettings.login_url !== NOT_CONFIGURED) {
          window.open(authSettings.login_url, '_self');
        }
      },
      error: err => {
        err.json().then(e => {
          if (e.message === 'User already verified.'){
            this.validateForm.setErrors({
              alreadyVerified: true
            });
          } else if (e.message === 'User not found.'){
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
