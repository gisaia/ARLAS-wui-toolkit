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

  public duplicate(newName: string, configId: string) {
    this.persistenceService.duplicate('config.json', configId, newName)
      .subscribe({
        next: () => {
          this.duplicatePreview(configId, newName);
          this.errorMessage = '';
          this.dialogRef.close();
        },
        error: (error) => this.raiseError(error)
      });
  }


  private duplicatePreview(configId: string, newConfigName: string): void {
    this.persistenceService.get(configId).subscribe({
      next: (currentConfig) => {
        const previewName = currentConfig.doc_key.concat('_preview');
        const newPreviewName = (!!newConfigName ? newConfigName : 'Copy of ' + currentConfig.doc_key).concat('_preview');
        this.persistenceService.existByZoneKey('preview', previewName).subscribe(
          exist => {
            if (exist.exists) {
              this.persistenceService.getByZoneKey('preview', previewName).subscribe({
                next: (data) => {
                  let previewReaders = [];
                  let previewWriters = [];
                  if (currentConfig.doc_readers) {
                    previewReaders = currentConfig.doc_readers.map(reader => reader.replace('config.json', 'preview'));
                  }
                  if (currentConfig.doc_writers) {
                    previewWriters = currentConfig.doc_writers.map(writer => writer.replace('config.json', 'preview'));
                  }
                  this.persistenceService.create(
                    'preview',
                    newPreviewName,
                    data.doc_value,
                    previewReaders,
                    previewWriters
                  ).subscribe({
                    error: (error) => this.raiseError(error)
                  });
                }
              });
            }
          });
      },
      error: (error) => this.raiseError(error)

    });

  }

  public rename(newName: string, configId: string) {
    this.persistenceService.get(configId).subscribe(
      currentConfig => {
        const key = currentConfig.doc_key;
        ['i18n', 'tour'].forEach(zone => ['fr', 'en'].forEach(lg => this.renameLinkedData(zone, key, newName, lg)));
        this.persistenceService.rename(configId, newName).subscribe({
          next: () => {
            this.errorMessage = '';
            this.dialogRef.close();
            let previewReaders = [];
            let previewWriters = [];
            if (currentConfig.doc_readers) {
              previewReaders = currentConfig.doc_readers.map(reader => reader.replace('config.json', 'preview'));
            }
            if (currentConfig.doc_writers) {
              previewWriters = currentConfig.doc_writers.map(writer => writer.replace('config.json', 'preview'));
            }
            this.persistenceService.updatePreview(newName.concat('_preview'), previewReaders, previewWriters);
          },
          error: error => this.raiseError(error)
        });
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


