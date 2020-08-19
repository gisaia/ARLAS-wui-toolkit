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
  configIdParam?: string;
  config: Config;
}

export interface Config {
  id: string;
  name: string;
  value: string;
  lastUpdate: number;
  readers: Array<string>;
  writers: Array<string>;
  zone: string;
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
export class ConfigMenuComponent implements OnInit {
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
          this.persistenceService.delete(id).subscribe(data => this.actionExecutedEmitter.next(action), error => {
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
        if (action.url && action.config && action.config.id) {
          this.openUrl(action.url.concat(action.config.id));
        }
        this.actionExecutedEmitter.next(action);
        break;
      }
      case ConfigActionEnum.DUPLICATE:
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
}
