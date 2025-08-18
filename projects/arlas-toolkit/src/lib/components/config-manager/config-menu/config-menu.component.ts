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

import { Component, Input, Output, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Configuration, ExploreApi } from 'arlas-api';
import { DataWithLinks } from 'arlas-persistence-api';
import { Subject, from, of } from 'rxjs';
import { catchError, filter, map, take } from 'rxjs/operators';
import { ArlasIamService } from '../../../services/arlas-iam/arlas-iam.service';
import { AuthentificationService } from '../../../services/authentification/authentification.service';
import { ArlasCollectionService } from '../../../services/collection/arlas-collection.service';
import { ErrorService } from '../../../services/error/error.service';
import { PersistenceService } from '../../../services/persistence/persistence.service';
import { ArlasSettingsService } from '../../../services/settings/arlas.settings.service';
import { ArlasConfigService } from '../../../services/startup/startup.service';
import { NO_ORGANISATION } from '../../../tools/consts';
import { ConfigAction, ConfigActionEnum } from '../../../tools/utils';
import { ActionModalComponent } from '../action-modal/action-modal.component';

@Component({
  selector: 'arlas-config-menu',
  templateUrl: './config-menu.component.html',
  styleUrls: ['./config-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConfigMenuComponent {
  @Input() public actions: Array<ConfigAction>;

  @Input() public zone: string;

  @Output() public actionExecutedEmitter = new Subject();

  public ConfigAction = ConfigActionEnum;

  public constructor(
    private readonly dialog: MatDialog,
    private readonly persistenceService: PersistenceService,
    private readonly configService: ArlasConfigService,
    private readonly collectionService: ArlasCollectionService,
    private readonly errorService: ErrorService,
    private readonly arlasIamService: ArlasIamService,
    private readonly arlasSettings: ArlasSettingsService,
    private readonly authenService: AuthentificationService
  ) {

  }

  public onActionClick(action: ConfigAction): void {
    switch (action.type) {
      case ConfigActionEnum.VIEW: {
        // redirect to arlas-wui-app with config ID;
        // http://localhost:4200/?config_id=50322281-d279-11ea-9fd1-0242ac160002
        if (action.url && action.config && action.config.id && action.configIdParam) {

          let url = action.url.concat('/?' + action.configIdParam + '=').concat(action.config.id);
          if (!!action.config.org && action.config.org !== NO_ORGANISATION) {
            url = url.concat('&org=' + action.config.org);
          }
          this.openUrl(url);
        }
        this.actionExecutedEmitter.next(action);
        break;
      }
      case ConfigActionEnum.DELETE: {
        // Open a confirm modal to validate this choice. Available only if updatable is true for this object
        const options = this.persistenceService.getOptionsSetOrg(action.config.org);
        this.getDialogRef(action).subscribe(id => {
          this.persistenceService.get(id, options).pipe(
            catchError((err) => {
              this.errorService.closeAll().afterAllClosed.pipe(take(1))
                .subscribe(() =>
                  this.errorService.emitUnauthorizedActionError(err.status, 'delete_dashboard', false));
              return of(err);
            })
          ).pipe(
            map((p: DataWithLinks) => {
              const parsedConfig = this.configService.parse(p.doc_value);
              if (this.configService.hasPreview(parsedConfig)) {
                const previewId = this.configService.getPreview(parsedConfig);
                this.persistenceService.deleteResource(previewId, options);
              }
              if (this.configService.hasI18n(parsedConfig)) {
                const i18nIds = this.configService.getI18n(parsedConfig);
                Object.keys(i18nIds).forEach(lg => {
                  this.persistenceService.deleteResource(i18nIds[lg], options);
                });
              }
              if (this.configService.hasTours(parsedConfig)) {
                const toursIds = this.configService.getTours(parsedConfig);
                Object.keys(toursIds).forEach(lg => {
                  this.persistenceService.deleteResource(toursIds[lg], options);
                });
              }
              this.persistenceService.delete(id, options)
                .subscribe(() => this.actionExecutedEmitter.next(action));
            })
          )
            .subscribe();
        });
        break;
      }
      case ConfigActionEnum.EDIT: {
        // redirect to arlas wui-builer with config ID
        if (action.url && action.config && action.config.id) {
          let url = action.url.concat(action.config.id);
          if (!!action.config.org && action.config.org !== NO_ORGANISATION) {
            url = url.concat('?org=' + action.config.org);
          }
          this.openUrl(url);
        }
        this.actionExecutedEmitter.next(action);
        break;
      }
      case ConfigActionEnum.DUPLICATE:
      case ConfigActionEnum.RENAME:
        if (action.config && action.config.id) {
          this.getDialogRef(action).subscribe(() => this.actionExecutedEmitter.next(action));
        }
        break;
      case ConfigActionEnum.SHARE: {
        if (action.config && action.config.id && action.config.value && JSON.parse(action.config.value).arlas?.server?.url) {
          const arlasServerUrl = JSON.parse(action.config.value).arlas.server.url;
          const configuration: Configuration = new Configuration();
          const arlasExploreApi: ExploreApi = new ExploreApi(
            configuration,
            arlasServerUrl,
            window.fetch
          );
          let headers = {};
          const authentConfig = this.arlasSettings.getAuthentSettings();
          if (authentConfig && authentConfig.auth_mode === 'iam') {
            headers = {
              Authorization: 'Bearer ' + this.arlasIamService.getAccessToken(),
              'arlas-org-filter': action.config.org
            };
          } else if (authentConfig && authentConfig.auth_mode === 'openid') {
            headers = {
              Authorization: 'Bearer ' + this.authenService.accessToken,
            };
          }
          const fetchOptions = { headers };
          from(arlasExploreApi.list(false, 0, fetchOptions)).subscribe(cdrs => {
            const publicCollections = cdrs.filter(c => (c.params.organisations as any).public).map(c => c.collection_name);
            const dashboardCollections = Array.from(this.collectionService.getCollectionFromDashboard(JSON.parse(action.config.value)));
            const publicChecker = (arr, target) => target.every(v => arr.includes(v));
            action.config.displayPublic = publicChecker(publicCollections, dashboardCollections);
            this.getDialogRef(action).subscribe(() => this.actionExecutedEmitter.next(action));
          });
        }
        break;
      }
      default: {
        console.error('Unknown action');
        break;
      }
    }
  }

  private getDialogRef(action: ConfigAction) {
    const dialogRef = this.dialog.open(ActionModalComponent, {
      disableClose: true,
      data: action
    });
    return dialogRef.afterClosed().pipe(filter(result => !!result));
  }

  private openUrl(url: string) {
    const win = window.open(url, '_blank');
    win.focus();
  }

}
