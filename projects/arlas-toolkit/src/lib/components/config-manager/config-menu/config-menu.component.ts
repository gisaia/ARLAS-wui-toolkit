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

import { Component, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Resource } from 'arlas-permissions-api';
import { filter } from 'rxjs/operators';
import { PermissionService } from '../../../services/permission/permission.service';
import { PersistenceService } from '../../../services/persistence/persistence.service';
import { Subject } from 'rxjs';
import { ConfigAction, ConfigActionEnum } from '../../../tools/utils';
import { ActionModalComponent } from '../action-modal/action-modal.component';

@Component({
  selector: 'arlas-config-menu',
  templateUrl: './config-menu.component.html',
  styleUrls: ['./config-menu.component.css']
})
export class ConfigMenuComponent implements OnInit {
  @Input() public actions: Array<ConfigAction>;
  @Input() public zone: string;

  @Output() public actionExecutedEmitter = new Subject();

  public ConfigAction = ConfigActionEnum;
  public canCreateDashboard = false;

  public constructor(
    private dialog: MatDialog,
    private persistenceService: PersistenceService,
    private permissionService: PermissionService
  ) {

  }
  public ngOnInit() {
    this.permissionService.get('persist/resource/config.json').subscribe((resources: Resource[]) => {
      this.canCreateDashboard = (resources.filter(r => r.verb === 'POST').length > 0);
    });
  }

  public onActionClick(action: ConfigAction): void {
    switch (action.type) {
      case ConfigActionEnum.VIEW: {
        // redirect to arlas-wui-app with config ID;
        // http://localhost:4200/?config_id=50322281-d279-11ea-9fd1-0242ac160002
        if (action.url && action.config && action.config.id && action.configIdParam) {
          this.openUrl(action.url.concat('/?' + action.configIdParam + '=').concat(action.config.id));
        }
        this.actionExecutedEmitter.next(action);
        break;
      }
      case ConfigActionEnum.DELETE: {
        // Open a confirm modal to validate this choice. Available only if updatable is true for this object
        this.getDialogRef(action).subscribe(id => {
          this.persistenceService.get(id).subscribe(
            data => {
              const key = data.doc_key;
              ['i18n', 'tour'].forEach(zone => ['fr', 'en'].forEach(lg => this.deleteLinkedData(zone, key, lg)));
              this.persistenceService.delete(id).subscribe(() => this.actionExecutedEmitter.next(action));
            });
        });
        break;
      }
      case ConfigActionEnum.EDIT: {
        // redirect to arlas wui-builer with config ID
        if (action.url && action.config && action.config.id) {
          this.openUrl(action.url.concat(action.config.id));
        }
        this.actionExecutedEmitter.next(action);
        break;
      }
      case ConfigActionEnum.DUPLICATE:
      case ConfigActionEnum.RENAME:
      case ConfigActionEnum.SHARE: {
        if (action.config && action.config.id) {
          this.getDialogRef(action).subscribe(() => this.actionExecutedEmitter.next(action));
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
    return dialogRef.afterClosed().pipe(filter(result => result !== false));
  }

  private openUrl(url: string) {
    const win = window.open(url, '_blank');
    win.focus();
  }

  private deleteLinkedData(zone: string, key: string, lg: string): void {
    this.persistenceService.existByZoneKey(zone, key.concat('_').concat(lg)).subscribe(
      exist => {
        if (exist.exists) {
          this.persistenceService.getByZoneKey(zone, key.concat('_').concat(lg))
            .subscribe(i => this.persistenceService.delete(i.id).subscribe(d => { }));
        }
      }
    );
  }
}
