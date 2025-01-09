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

import { Component, OnInit, Inject } from '@angular/core';
import { AuthentificationService } from '../../services/authentification/authentification.service';
import { MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { NgIf } from '@angular/common';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatButton } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'arlas-tool-reconnect-dialog',
  templateUrl: './reconnect-dialog.component.html',
  styleUrls: ['./reconnect-dialog.component.css'],
  standalone: true,
  imports: [NgIf, MatDialogTitle, CdkScrollable, MatDialogContent, MatDialogActions, MatButton, MatDialogClose, TranslateModule]
})
export class ReconnectDialogComponent implements OnInit {

  public code: number;
  public authService;
  public constructor(private authentService: AuthentificationService,
    @Inject(MAT_DIALOG_DATA) data) {
    this.code = data.code;
  }

  public ngOnInit() {
  }

  public login() {
    this.authentService.login();
  }

  public logout() {
    this.authentService.logout();
  }
}
