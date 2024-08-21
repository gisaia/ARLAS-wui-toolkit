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
import { ConfirmedValidator } from '../../tools/utils';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ArlasIamService } from '../../services/arlas-iam/arlas-iam.service';

@Component({
  selector: 'arlas-tool-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  public changeForm: FormGroup;
  public validated = false;
  public displayForm = true;

  public constructor(
    private formBuilder: FormBuilder,
    private iamService: ArlasIamService,
  ) { }

  public ngOnInit(): void {
    this.changeForm = this.formBuilder.group({
      old_password: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirm_password: ['', [Validators.required]]
    }, {
      validator: ConfirmedValidator('password', 'confirm_password')
    });
  }

  public submit(): void {
    this.validated = false;
    this.iamService.change(this.changeForm.get('old_password').value, this.changeForm.get('password').value).subscribe({
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
