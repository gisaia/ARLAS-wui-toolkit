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
import { ConfigActionEnum, ConfigAction } from '../config-menu/config-menu.component';
import { PersistenceService } from '../../../services/persistence/persistence.service';
import { Error } from '../../../services/startup/startup.service';
import { ErrorService } from '../../../services/error/error.service';
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
    this.persistenceService.duplicate('config.json', configId,
      value).subscribe(data => {
        this.duplicateError = '';
        this.dialogRef.close();
      },
        error => {
          this.duplicateError = 'A configuration with this name exists already, please choose another name.';
        });
  }

  public create(name: string) {
    this.persistenceService.create('config.json', name, '{}', [], []).subscribe(data => {
      this.duplicateError = '';
      this.dialogRef.close(data.id);
    },
      error => {
        this.duplicateError = 'A configuration with this name exists already, please choose another name.';
      });
  }

  public closeShare(event: [boolean, any]) {
    // update share is successful, close dialog
    if (event[0]) {
      this.dialogRef.close();
    }
  }


}


