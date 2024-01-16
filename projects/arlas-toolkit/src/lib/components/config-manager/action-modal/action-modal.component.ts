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
import { Config, ConfigAction, ConfigActionEnum } from '../../../tools/utils';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { ArlasConfigService } from '../../../services/startup/startup.service';
import { DataWithLinks, Exists } from 'arlas-persistence-api';
import { Observable, catchError, map, of } from 'rxjs';

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
    private persistenceService: PersistenceService,
    private configurationService: ArlasConfigService
  ) {
    this.action = data;
  }

  public duplicate(newName: string, config: Config) {
    const arlasConfig = this.configurationService.parse(config.value);
    if (!!arlasConfig) {
      const previewId = this.configurationService.getPreview(arlasConfig);
      if (previewId) {
        this.duplicatePreviewThenConfig$(previewId, arlasConfig, config.name, newName).subscribe();
      } else {
        this.duplicateConfig$(config.id, newName).subscribe();
      }
    } else {
      /** */ console.error('Error duplicating the config: the config is not valid');
    }
  }


  private duplicateConfig$(configId: string, newConfigName: string) {
    return this.persistenceService.duplicate('config.json', configId, newConfigName)
      .pipe(
        catchError(() => /** todo */ of()));

  }

  private duplicatePreviewThenConfig$(previewId: string, arlasConfig: any, oldConfigName: string, newConfigName: string) {
    return this.duplicatePreview$(previewId, newConfigName)
      .pipe(
        map((p: DataWithLinks) => {
          const newArlasConfig = this.configurationService.updatePreview(arlasConfig, p.id);
          const stringifiedNewArlasConfig = JSON.stringify(newArlasConfig);
          this.persistenceService.duplicateValue('config.json', stringifiedNewArlasConfig, oldConfigName, newArlasConfig);
        })
      ).pipe(
        catchError(() => /** todo */ of()));

  }

  private duplicatePreview$(previewId: string, newConfigName: string): Observable<any> {
    const newPreviewName = newConfigName.concat('_preview');
    return this.persistenceService.get(previewId)
      .pipe(map((p: DataWithLinks) => this.persistenceService.create('preview', newPreviewName, p.doc_value)))
      .pipe(catchError(() => /** todo*/ of()));
  }

  public rename(newName: string, configId: string) {
    this.persistenceService.get(configId).subscribe(
      currentConfig => {
        const key = currentConfig.doc_key;
        // ['i18n', 'tour'].forEach(zone => ['fr', 'en'].forEach(lg => this.renameLinkedData(zone, key, newName, lg)));
        this.persistenceService.rename(configId, newName).subscribe({
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
}


