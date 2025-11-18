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
import { marker } from '@colsen1991/ngx-translate-extract-marker';
import { DataWithLinks } from 'arlas-persistence-api';
import { Observable, catchError, forkJoin, map, mergeMap, of, take, tap } from 'rxjs';
import { ErrorService } from '../../../services/error/error.service';
import { PersistenceService } from '../../../services/persistence/persistence.service';
import { ArlasConfigService } from '../../../services/startup/startup.service';
import { Config, ConfigAction, ConfigActionEnum } from '../../../tools/utils';

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
    private configurationService: ArlasConfigService,
    private errorService: ErrorService
  ) {
    this.action = data;
  }

  public duplicate(newName: string, config: Config) {
    const arlasConfig = this.configurationService.parse(config.value);
    if (!!arlasConfig) {
      const hasResources = this.configurationService.hasResources(arlasConfig);
      if (hasResources) {
        this.duplicateResourcesThenConfig$(arlasConfig, newName, config.org).subscribe({
          error: error => this.raiseError(error),
          next: () => {
            this.dialogRef.close(this.action);
          }
        });
      } else {
        this.duplicateConfig$(config.id, newName, config.org).subscribe({
          error: error => this.raiseError(error),
          next: () => {
            this.dialogRef.close(this.action);
          }
        });
      }
    } else {
      console.error('Error duplicating the config: the config is not valid');
    }
  }


  private duplicateConfig$(configId: string, newConfigName: string, org?: string) {
    return this.persistenceService.duplicate('config.json', configId, newConfigName, this.getOptionsSetOrg(org))
      .pipe(
        catchError((err) => {
          this.errorService.closeAll().afterAllClosed.pipe(take(1))
            .subscribe(() => this.errorService.emitUnauthorizedActionError(
              err.status, marker('You are not allowed to duplicate the dashboard'), false));
          return of(err);
        }));
  }

  private duplicateResourcesThenConfig$(arlasConfig: any, newConfigName: string, org: string): Observable<DataWithLinks> {
    return this.duplicateResources$(arlasConfig, newConfigName, org)
      .pipe(
        mergeMap((stringifiedNewArlasConfig: string) =>
          this.persistenceService.create('config.json', newConfigName, stringifiedNewArlasConfig, [], [],
            this.getOptionsSetOrg(org)))
      ).pipe(
        catchError((err) => {
          this.errorService.closeAll().afterAllClosed.pipe(take(1))
            .subscribe(() => this.errorService.emitUnauthorizedActionError(
              err.status, marker('You are not allowed to duplicate the dashboard'), false));
          return of();
        })
      );
  }

  public create(name: string) {
    this.persistenceService.create('config.json', name, '{}', [], [])
      .subscribe({
        next: (data) => {
          this.errorMessage = '';
          this.dialogRef.close(data.id);
        },
        error: (e) => this.raiseError(e)
      });
  }


  public duplicateResources$(arlasConfig: any, newConfigName: string, org: string): Observable<string> {
    const resources$: Observable<DataWithLinks>[] = [];
    if (this.configurationService.hasPreview(arlasConfig)) {
      const previewId = this.configurationService.getPreview(arlasConfig);
      resources$.push(
        this.duplicatePreview$(previewId, newConfigName, org).pipe(
          tap((d: DataWithLinks) => this.configurationService.updatePreview(arlasConfig, d.id))
        )
      );
    }
    if (this.configurationService.hasI18n(arlasConfig)) {
      const i18ns = this.configurationService.getI18n(arlasConfig);
      Object.keys(i18ns).forEach(lg => {
        resources$.push(
          this.duplicateI18n$(i18ns[lg], lg, newConfigName, org).pipe(
            tap((d: DataWithLinks) => this.configurationService.updateI18n(arlasConfig, lg, d.id))
          )
        );
      });
    }

    if (this.configurationService.hasTours(arlasConfig)) {
      const tours = this.configurationService.getTours(arlasConfig);
      Object.keys(tours).forEach(lg => {
        resources$.push(
          this.duplicateTour$(tours[lg], lg, newConfigName, org).pipe(
            tap((d: DataWithLinks) => this.configurationService.updateTour(arlasConfig, lg, d.id))
          )
        );
      });
    }

    return forkJoin(resources$).pipe(map(p => JSON.stringify(arlasConfig)));
  }

  private duplicatePreview$(previewId: string, newConfigName: string, org?: string): Observable<DataWithLinks> {
    const newPreviewName = newConfigName.concat('_preview');
    return this.persistenceService.get(previewId, this.getOptionsSetOrg(org))
      .pipe(mergeMap((p: DataWithLinks) =>
        this.persistenceService.create('preview', newPreviewName, p.doc_value, [], [],
          this.getOptionsSetOrg(p.doc_organization))
      ));
  }

  private duplicateI18n$(i18nId: string, lg: string, newConfigName: string, org?: string): Observable<DataWithLinks> {
    const newI18nName = newConfigName.concat('_i18n_' + lg);
    return this.persistenceService.get(i18nId, this.getOptionsSetOrg(org))
      .pipe(mergeMap((p: DataWithLinks) =>
        this.persistenceService.create('i18n', newI18nName, p.doc_value, [], [],
          this.getOptionsSetOrg(p.doc_organization))
      ));
  }

  private duplicateTour$(i18nId: string, lg: string, newConfigName: string, org?: string): Observable<DataWithLinks> {
    const newTourName = newConfigName.concat('_tour_' + lg);
    return this.persistenceService.get(i18nId, this.getOptionsSetOrg(org))
      .pipe(mergeMap((p: DataWithLinks) =>
        this.persistenceService.create('tour', newTourName, p.doc_value, [], [],
          this.getOptionsSetOrg(p.doc_organization))
      ));
  }

  public rename(newName: string, config: Config) {
    const options = this.getOptionsSetOrg(config.org);
    this.persistenceService.get(config.id, options)
      .pipe(
        catchError((err) => {
          this.errorService.closeAll().afterAllClosed.pipe(take(1))
            .subscribe(() =>
              this.errorService.emitUnauthorizedActionError(err.status, marker('You are not allowed to rename the dashboard'), false));
          return of(err);
        })
      )
      .subscribe(
        (currentConfig: DataWithLinks) => {
          const arlasConfig = this.configurationService.parse(currentConfig.doc_value);
          if (!!arlasConfig) {
            if (this.configurationService.hasPreview(arlasConfig)) {
              const previewId = this.configurationService.getPreview(arlasConfig);
              this.persistenceService.renameResource(previewId, newName + '_preview', options);
            }
            if (this.configurationService.hasI18n(arlasConfig)) {
              const i18nIds = this.configurationService.getI18n(arlasConfig);
              Object.keys(i18nIds).forEach(lg => {
                this.persistenceService.renameResource(i18nIds[lg], newName + '_i18n_' + lg, options);
              });
            }
            if (this.configurationService.hasTours(arlasConfig)) {
              const toursIds = this.configurationService.getTours(arlasConfig);
              Object.keys(toursIds).forEach(lg => {
                this.persistenceService.renameResource(toursIds[lg], newName + '_i18n_' + lg, options);
              });
            }
          }
          this.persistenceService.rename(config.id, newName, this.getOptionsSetOrg(config.org))
            .subscribe({
              error: error => this.raiseError(error),
              next: () => {
                this.dialogRef.close(this.action);
              }
            });
        });
  }

  public closeShare(event: [boolean, any]) {
    // update share is successful, close dialog
    if (event[0]) {
      this.dialogRef.close(event[1]);
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

  private getOptionsSetOrg(org: string) {
    return this.persistenceService.getOptionsSetOrg(org);
  }
}


