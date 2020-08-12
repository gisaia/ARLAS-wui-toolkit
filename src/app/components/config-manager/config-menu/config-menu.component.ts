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

import { Component, OnInit, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { ActionModalComponent } from '../action-modal/action-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { filter } from 'rxjs/operators';
import { PersistenceService } from '../../../services/persistence/persistence.service';
import { Subject } from 'rxjs';
import { ErrorService } from '../../../services/error/error.service';
import { Error } from '../../../services/startup/startup.service';


export interface ConfigAction {
  type: ConfigActionEnum;
  enabled?: boolean;
  name?: string;
  url?: string;
  configId?: string;
  configIdParam?: string;
}

export enum ConfigActionEnum {
  VIEW,
  DELETE,
  EDIT,
  DUPLICATE,
  SHARE,
  CREATE
}

@Component({
  selector: 'arlas-config-menu',
  templateUrl: './config-menu.component.html',
  styleUrls: ['./config-menu.component.css']
})
export class ConfigMenuComponent implements OnInit, OnChanges {
  @Input() public actions: Array<ConfigAction>;
  @Input() public zone: string;

  @Output() public actionExecutedEmitter = new Subject();

  public ConfigAction = ConfigActionEnum;
  constructor(
    private dialog: MatDialog,
    private persistenceService: PersistenceService,
    private errorService: ErrorService
  ) {

  }
  public ngOnInit() {

  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['actions'] !== undefined) {
      console.log('change');
    }
  }

  public onActionClick(action: ConfigAction): void {
    switch (action.type) {
      case ConfigActionEnum.VIEW: {
        // redirect to arlas-wui-app with config ID;
        // http://localhost:4200/?config_id=50322281-d279-11ea-9fd1-0242ac160002
        if (action.url && action.configId && action.configIdParam) {
          this.openUrl(action.url.concat('/?' + action.configIdParam + '=').concat(action.configId));
        }
        break;
      }
      case ConfigActionEnum.DELETE: {
        // Open a confirm modal to validate this choice. Available only if updatable is true for this object
        this.getDialogRef(action).subscribe(id => {
          this.persistenceService.delete(id).subscribe(data => this.actionExecutedEmitter.next(), error => {
            const err: Error = {
              origin: 'Configuration deletion error',
              message: error.toString(),
              reason: ''
            };
            this.errorService.errorEmitter.next(err);
          });
        });
        break;
      }
      case ConfigActionEnum.EDIT: {
        // redirect to arlas wui-builer with config ID
        if (action.url && action.configId) {
          this.openUrl(action.url.concat(action.configId));
        }
        break;
      }
      case ConfigActionEnum.DUPLICATE: {
        //  Open a modal to enter the name of a new configuration based on the selected one.
        const dialogRef = this.dialog.open(ActionModalComponent, {
          data: {
            name: action.name,
            configId: action.configId,
            type: action.type
          }
        });
        dialogRef.afterClosed().subscribe(() => this.actionExecutedEmitter.next());
        break;
      }
      case ConfigActionEnum.SHARE: {
        // Open a modal to set the permissions read/write for each group
        // call persistence API to retrieve group for the zone
        // open share component
        // select group
        // update the data with the PUT endpoint of persistence
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
      data: {
        name: action.name,
        configId: action.configId,
        type: action.type
      }
    });

    return dialogRef.afterClosed().pipe(filter(result => result !== false));
  }

  private openUrl(url: string) {
    const win = window.open(url, '_blank');
    win.focus();
  }
}
