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

import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PersistenceService } from '../../../services/persistence/persistence.service';
import { ConfigAction, ConfigActionEnum } from '../../../tools/utils';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

@Component({
  selector: 'arlas-action-modal',
  templateUrl: './action-modal.component.html',
  styleUrls: ['./action-modal.component.css']
})
export class ActionModalComponent {

  public action: ConfigAction;
  public value: string;
  public ConfigAction = ConfigActionEnum;

  public duplicateError = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) data: ConfigAction,
    private dialogRef: MatDialogRef<ActionModalComponent>,
    private persistenceService: PersistenceService
  ) {
    this.action = data;
  }

  public duplicate(value: string, configId: string) {
    this.persistenceService.duplicate('config.json', configId, value)
      .subscribe(
        () => {
          this.duplicateError = '';
          this.dialogRef.close();
        },
        error => {
          this.duplicateError = this.errorMessage(error.status);
        });
  }

  public create(name: string) {
    this.persistenceService.create('config.json', name, '{}', [], [])
      .subscribe(
        data => {
          this.duplicateError = '';
          this.dialogRef.close(data.id);
        },
        error => {
          this.duplicateError = this.errorMessage(error.status);
        });
  }

  public closeShare(event: [boolean, any]) {
    // update share is successful, close dialog
    if (event[0]) {
      this.dialogRef.close();
    }
  }

  public errorMessage(errorCode: number): string {
    let message = '';
    switch (errorCode) {
      case 401:
        message = marker('Unauthorized to create a dashboard, you need to log in');
        break;
      case 403:
        message = marker('Missing permissions to create a dashboard');
        break;
      default:
        message = marker('A configuration with this name exists already, please choose another name');
    }
    return message;
  }


}


