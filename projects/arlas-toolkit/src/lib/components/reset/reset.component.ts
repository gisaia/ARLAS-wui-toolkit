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
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ArlasIamService } from '../../services/arlas-iam/arlas-iam.service';
import { ConfirmedValidator } from '../../tools/utils';
import { NgIf } from '@angular/common';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'arlas-tool-reset',
    templateUrl: './reset.component.html',
    styleUrls: ['./reset.component.css'],
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, NgIf, MatFormField, MatLabel, MatInput, MatButton, RouterLink, TranslateModule]
})
export class ResetComponent implements OnInit {

  public resetForm: FormGroup;
  public validated = false;

  public userId = null;
  public token = null;

  public constructor(
    private formBuilder: FormBuilder,
    private iamService: ArlasIamService,
    private route: ActivatedRoute,
  ) { }

  public ngOnInit(): void {
    this.resetForm = this.formBuilder.group({
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

  public onSubmit(): void {
    this.validated = false;
    this.iamService.reset(this.userId, this.token, this.resetForm.get('password').value).subscribe({
      next: (data) => {
        this.validated = true;
      },
      error: err => {
        console.error(err);
      }
    });
  }
}
