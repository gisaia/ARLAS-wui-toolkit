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

import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ArlasIamService } from '../../services/arlas-iam/arlas-iam.service';
import { AuthentificationService } from '../../services/authentification/authentification.service';
import { ArlasSettingsService } from '../../services/settings/arlas.settings.service';
import { ArlasError } from '../../tools/errors/error';
import { DeniedAccessData } from '../../tools/utils';

@Component({
  selector: 'arlas-denied-access-dialog',
  templateUrl: './denied-access-dialog.component.html',
  styleUrls: ['./denied-access-dialog.component.scss']
})
export class DeniedAccessDialogComponent implements OnInit, OnDestroy {

  private isAuthentActivated: boolean;
  private authentMode: 'openid' | 'iam';

  public forceAction = false;
  public arlasError: ArlasError;
  private actionSubscription: Subscription;
  public constructor(
    @Inject(MAT_DIALOG_DATA) data: DeniedAccessData,
    private settingsService: ArlasSettingsService,
    private authentService: AuthentificationService,
    private arlasIamService: ArlasIamService,
    private dialog: MatDialogRef<DeniedAccessDialogComponent>,
    private router: Router) {
    this.arlasError = data.error;
    this.forceAction = data.forceAction;
  }

  public ngOnInit() {
    const authSettings = this.settingsService.getAuthentSettings();
    this.authentMode = !!authSettings ? authSettings.auth_mode : undefined;
    this.isAuthentActivated = !!authSettings && !!authSettings.use_authent;
    if (this.isAuthentActivated && !this.authentMode) {
      this.authentMode = 'openid';
    }
    this.actionSubscription = this.arlasError.actionSeeker$.subscribe({
      next: (type) => {
        if (type === 'login') {
          this.login();
          this.dialog.close();
        }
      }
    });
  }

  public ngOnDestroy(): void {
    if (this.actionSubscription) {
      this.actionSubscription.unsubscribe();
    }
  }

  private login() {
    if (this.authentMode === 'openid') {
      this.authentService.login();
    } else if (this.authentMode === 'iam') {
      this.checkIamCurrentUrl();
      this.router.navigate(['login']);
    }
  }


  private checkIamCurrentUrl() {
    const url = new URL(window.location.href);
    const paramOrg = url.searchParams.get('org');
    const paramConfigId = url.searchParams.get('config_id');
    // it meanse it's arlas-wui, we will ask to login in arlas-wui ignoring the
    // login_uri, because after login we can go back to previous state !
    if (paramOrg && paramConfigId) {
      this.arlasIamService.declareReloadState(window.location.href);
    }
  }

}
