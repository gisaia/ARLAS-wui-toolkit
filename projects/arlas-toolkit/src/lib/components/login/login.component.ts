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
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatLabel, MatPrefix, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LoginData } from 'arlas-iam-api';
import { finalize } from 'rxjs';
import { ArlasIamService } from '../../services/arlas-iam/arlas-iam.service';
import { ErrorService } from '../../services/error/error.service';
import { ArlasSettingsService } from '../../services/settings/arlas.settings.service';
import { generateUserCacheBust, NOT_CONFIGURED } from '../../tools/utils';

@Component({
  selector: 'arlas-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    FormsModule, ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatIcon,
    MatPrefix, MatError, MatSuffix, RouterLink, MatButton, TranslatePipe]
})
export class LoginComponent implements OnInit {

  public showPassword = false;
  public loginForm = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });
  public isLoading = false;
  public showPage = false;
  public displayNoAccount = false;

  public constructor(
    private readonly iamService: ArlasIamService,
    private readonly settingsService: ArlasSettingsService,
    private readonly errorService: ErrorService,
    private readonly router: Router
  ) { }


  public ngOnInit(): void {
    this.errorService.closeAll();
    const authSettings = this.settingsService.getAuthentSettings();
    this.displayNoAccount = !!authSettings?.sign_up_enabled;
    this.showPage = false;
    this.iamService.refresh().pipe(finalize(() => this.showPage = true)).subscribe({
      next: (loginData: LoginData) => {
        // TODO: change LoginData to have both user and token ?
        this.iamService.user = loginData.user;
        this.iamService.setHeadersFromAccesstoken(loginData.access_token as string);
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
        this.iamService.logoutWithoutRedirection$().pipe(
          finalize(() => this.errorService.closeAll())
        ).subscribe();

      }
    });
  }

  public onSubmit(): void {
    this.isLoading = true;
    this.iamService.login(this.loginForm.value.email as string, this.loginForm.value.password as string).subscribe({
      next: loginData => {
        // Derive a deterministic cache-busting key from the user's unique ID
        // This ensures cached responses are scoped per user while remaining reusable across sessions
        if (loginData?.user?.id) {
          sessionStorage.setItem('cache_bust', generateUserCacheBust(loginData.user.id));
        }
        this.iamService.user = loginData.user;
        this.iamService.setHeadersFromAccesstoken(loginData.access_token as string);
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
        this.errorService.closeAll();
        this.iamService.logoutWithoutRedirection$().pipe(
          finalize(() => {
            this.loginForm.setErrors({
              wrong: true
            });
            this.isLoading = false;
          })
        ).subscribe();

      }
    }

    );
  }

}
