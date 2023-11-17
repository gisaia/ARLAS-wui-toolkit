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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginData, RefreshToken } from 'arlas-iam-api';
import { ArlasIamService } from '../../services/arlas-iam/arlas-iam.service';
import { ArlasSettingsService } from '../../services/settings/arlas.settings.service';
import { finalize } from 'rxjs';
import { NOT_CONFIGURED } from '../../tools/utils';
import { ErrorService } from '../../services/error/error.service';

@Component({
  selector: 'arlas-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public showPassword = false;
  public loginForm: FormGroup;
  public isLoading = false;
  public showPage = false;

  public constructor(
    private formBuilder: FormBuilder,
    private iamService: ArlasIamService,
    private settingsService: ArlasSettingsService,
    private errorService: ErrorService,
    private router: Router
  ) { }

  public ngOnInit(): void {
    this.errorService.closeAll();
    const authSettings = this.settingsService.getAuthentSettings();
    const refreshToken: RefreshToken = this.iamService.getRefreshToken();
    if (!!refreshToken) {
      this.showPage = false;
      /** set latest stored headers info. */
      const accessToken = this.iamService.getAccessToken();
      this.iamService.setHeadersFromAccesstoken(accessToken);
      this.iamService.refresh(refreshToken.value).pipe(finalize(() => this.showPage = true)).subscribe({
        next: (loginData: LoginData) => {
          this.iamService.user = loginData.user;
          this.iamService.setHeadersFromAccesstoken(loginData.accessToken);
          this.iamService.storeRefreshToken(loginData.refreshToken);
          this.iamService.notifyTokenRefresh(loginData);
          localStorage.removeItem('arlas-logout-event');
          if (!!this.iamService.reloadState) {
            this.iamService.consumeReloadState();
          } else {
            if (!!authSettings && authSettings.redirect_uri && authSettings.redirect_uri !== NOT_CONFIGURED) {
              window.open(authSettings.redirect_uri, '_self');
            } else {
              this.router.navigate(['/']);
            }
          }
        },
        error: () => {
          this.iamService.logoutWithoutRedirection();
          this.errorService.closeAll();
        }
      });
    } else {
      if (!!authSettings && authSettings.login_url && authSettings.login_url !== NOT_CONFIGURED && !this.iamService.reloadState) {
        window.open(authSettings.login_url, '_self');
      } else {
        this.showPage = true;
      }
    }

    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', [Validators.required]]
    });
  }

  public onSubmit(): void {
    this.isLoading = true;
    this.iamService.login(this.loginForm.get('email').value, this.loginForm.get('password').value).subscribe({
      next: loginData => {
        this.iamService.user = loginData.user;
        this.iamService.setHeadersFromAccesstoken(loginData.accessToken);
        this.iamService.storeRefreshToken(loginData.refreshToken);
        this.iamService.notifyTokenRefresh(loginData);
        this.iamService.startRefreshTokenTimer(loginData);
        localStorage.removeItem('arlas-logout-event');
        const authSettings = this.settingsService.getAuthentSettings();
        if (!!this.iamService.reloadState) {
          this.iamService.consumeReloadState();
        } else {
          if (!!authSettings && authSettings.redirect_uri && authSettings.redirect_uri !== NOT_CONFIGURED) {
            window.open(authSettings.redirect_uri, '_self');
          } else {
            this.router.navigate(['/']);
          }
        }
        this.isLoading = false;
      },
      error: () => {
        this.iamService.logoutWithoutRedirection();
        this.loginForm.setErrors({
          wrong: true
        });
        this.isLoading = false;
      }
    }

    );
  }

}
