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
import { AuthentificationService } from '../../services/authentification/authentification.service';
import { ArlasIamService } from '../../services/arlas-iam/arlas-iam.service';
import { ArlasSettingsService } from '../../services/settings/arlas.settings.service';
import { NgIf, NgFor } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'arlas-user-infos',
  templateUrl: './user-infos.component.html',
  styleUrls: ['./user-infos.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor, TranslateModule]
})
export class UserInfosComponent implements OnInit {

  private isAuthentActivated: boolean;
  public authentMode;

  public organisations: Array<string>;
  public name: string;
  public email: string;
  public avatar: string;

  public constructor(
    private authentService: AuthentificationService,
    private arlasIamService: ArlasIamService,
    private settingsService: ArlasSettingsService
  ) { }

  public ngOnInit() {
    const authSettings = this.settingsService.getAuthentSettings();
    this.authentMode = !!authSettings ? authSettings.auth_mode : undefined;
    this.isAuthentActivated = !!authSettings && !!authSettings.use_authent;
    if (this.isAuthentActivated && !this.authentMode) {
      this.authentMode = 'openid';
    }
    if (!!authSettings) {
      if (authSettings.auth_mode === 'iam') {
        const userInfos = this.arlasIamService.user;
        if (userInfos.firstName && userInfos.lastName) {
          this.name = userInfos.firstName + ' ' + userInfos.lastName;
        }
        this.email = userInfos.email;
        this.organisations = userInfos.organisations.map(o => o.displayName);
        this.avatar = '';
      } else {
        this.authentService.loadUserInfo().subscribe(user => {
          const data = user.info;
          this.name = data['nickname'];
          this.email = data['name'];
          this.organisations = data['http://arlas.io/roles'].filter(r => r.startsWith('org/'))
            .map(r => this.computeName(r));
          this.avatar = data['picture'];
        });
      }
    }
  }

  public computeName = (n) => {
    if (typeof n !== 'string') {
      return '';
    }
    const list = n.split('/');
    list.shift();
    return list.join(' ');
  };
}
