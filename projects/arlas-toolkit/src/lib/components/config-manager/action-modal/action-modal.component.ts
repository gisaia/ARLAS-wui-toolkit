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

  public errorMessage = '';
  public constructor(
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
          this.errorMessage = '';
          this.dialogRef.close();
        },
        error => this.raiseError(error));
  }

  public rename(newName: string, configId: string) {
    this.persistenceService.get(configId).subscribe(
      data => {
        const key = data.doc_key;
        ['i18n', 'tour'].forEach(zone => ['fr', 'en'].forEach(lg => this.renameLinkedData(zone, key, newName, lg)));
        this.persistenceService.rename(configId, newName).subscribe(
          () => {
            this.errorMessage = '';
            this.dialogRef.close();
          },
          error => this.raiseError(error));
      });
  }

  public create(name: string) {
    this.persistenceService.create('config.json', name, '{}', [], [])
      .subscribe(
        data => {
          this.errorMessage = '';
          this.dialogRef.close(data.id);
        },
        error => this.raiseError(error));
  }

  public closeShare(event: [boolean, any]) {
    // update share is successful, close dialog
    if (event[0]) {
      this.dialogRef.close();
    }
  }

  public raiseError(err: any) {
    switch (err.status) {
      case 401:
        this.errorMessage = marker('Unauthorized to create a dashboard, you need to log in');
        break;
      case 403:
        this.errorMessage = marker('Missing permissions to create a dashboard');
        break;
      case 500:
        err.json().then(e => {
          if ((e.message as string).indexOf('already exists') > 0) {
            this.errorMessage = marker('A configuration with this name exists already, please choose another name');
          } else {
            this.errorMessage = marker('An error occurred, please try later');
          }
        });
        break;
      default:
        this.errorMessage = marker('An error occurred, please try later');
    }
  }

  private renameLinkedData(zone: string, key: string, newName: string, lg: string) {
    this.persistenceService.existByZoneKey(zone, key.concat('_').concat(lg)).subscribe(
      exist => {
        if (exist.exists) {
          this.persistenceService.getByZoneKey(zone, key.concat('_').concat(lg))
            .subscribe(i => this.persistenceService.rename(i.id, newName.concat('_').concat(lg)).subscribe(d => { }));
        }
      }
    );
  }
}


