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
import { FormGroup, FormBuilder, Validators, FormGroupDirective } from '@angular/forms';
import { ArlasIamService } from '../../services/arlas-iam/arlas-iam.service';

@Component({
  selector: 'arlas-tool-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.css']
})
export class ForgotComponent implements OnInit {

  public forgotForm: FormGroup;
  public validated = false;
  public displayForm = true;

  public constructor(
    private formBuilder: FormBuilder,
    private iamService: ArlasIamService
  ) { }

  public ngOnInit(): void {
    this.forgotForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]]
    });
  }

  public onSubmit(formDirective: FormGroupDirective) {
    this.validated = false;
    this.iamService.forgot(this.forgotForm.get('email').value).subscribe({
      next: () => {
        this.validated = true;
        formDirective.resetForm();
        this.forgotForm.reset();
        this.displayForm  = false;
      },
      error: err => {
        // API respond with error (but the resquest is OK)
        this.validated = true;
      }
    });
  }

}
