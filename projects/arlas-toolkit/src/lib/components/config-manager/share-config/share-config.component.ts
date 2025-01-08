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

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PersistenceService } from '../../../services/persistence/persistence.service';
import { Config } from '../../../tools/utils';
import { ArlasConfigService } from '../../../services/startup/startup.service';
import { catchError, of, take } from 'rxjs';
import { AuthorisationOnActionError } from '../../../tools/errors/authorisation-on-action-error';
import { ErrorService } from '../../../services/error/error.service';
import { MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { MatCheckbox } from '@angular/material/checkbox';
import { NgIf } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

export interface PersistenceGroup {
  name: string;
  label: string;
  reader: boolean;
  writer: boolean;
}
@Component({
    selector: 'arlas-share-config',
    templateUrl: './share-config.component.html',
    styleUrls: ['./share-config.component.css'],
    standalone: true,
    imports: [MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatCheckbox, NgIf, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, MatButton, TranslateModule]
})
export class ShareConfigComponent implements OnInit {

  @Input() public config: Config;
  @Output() public updateEmitter: EventEmitter<[boolean, any]> = new EventEmitter();
  public groups: Array<PersistenceGroup>;

  public constructor(private persistenceService: PersistenceService,
    private configurationService: ArlasConfigService, private errorService: ErrorService
  ) {

  }
  public ngOnInit() {
    const options = this.getOptionsSetOrg(this.config.org);
    this.persistenceService.getGroupsByZone(this.config.zone, options).pipe(take(1)).subscribe((s: any) => {
      this.groups = new Array();
      s.forEach(g => {
        const paths = g.split('/');
        const group: PersistenceGroup = {
          name: g,
          label: paths[paths.length - 1],
          reader: (new Set(this.config.readers)).has(g),
          writer: (new Set(this.config.writers)).has(g)
        };
        if(g === 'group/public'){
          if(this.config.displayPublic){
            this.groups.push(group);
          }
        }else{
          this.groups.push(group);
        }
      });
    });
  }

  public updateGroups() {
    const readers = this.config.readers ? new Set<string>(this.config.readers) : new Set<string>();
    const writers = this.config.writers ? new Set<string>(this.config.writers) : new Set<string>();
    this.groups.forEach(g => {
      if (g.reader) {
        readers.add(g.name);
      } else {
        readers.delete(g.name);
      }
      if (g.writer) {
        writers.add(g.name);
      } else {
        writers.delete(g.name);
      }
    });
    const options = this.getOptionsSetOrg(this.config.org);
    this.persistenceService
      .update(this.config.id, this.config.value, this.config.lastUpdate,
        this.config.name, Array.from(readers), Array.from(writers), options)
      .pipe(
        catchError((err) => {
          this.errorService.closeAll().afterAllClosed.pipe(take(1))
            .subscribe(() =>
              this.errorService.emitAuthorisationError(new AuthorisationOnActionError(err.status, 'share_dashboard'), false));
          return of(err);
        })
      )
      .subscribe({
        next: () => {
          this.config.readers = Array.from(readers);
          this.config.writers = Array.from(writers);
          this.updateEmitter.emit([true, this.config]);
        }
      });
    const arlasConfig = this.configurationService.parse(this.config.value);
    if (!!arlasConfig) {
      const resourcesGroups = this.persistenceService.dashboardToResourcesGroups(Array.from(readers), Array.from(writers));
      if (this.configurationService.hasPreview(arlasConfig)) {
        const previewId = this.configurationService.getPreview(arlasConfig);
        this.persistenceService.updateResource(previewId, resourcesGroups.readers, resourcesGroups.writers, undefined, options);
      }
      if (this.configurationService.hasI18n(arlasConfig)) {
        const i18nIds = this.configurationService.getI18n(arlasConfig);
        Object.keys(i18nIds).forEach(lg => {
          this.persistenceService.updateResource(i18nIds[lg], resourcesGroups.readers, resourcesGroups.writers, undefined, options);
        });
      }
      if (this.configurationService.hasTours(arlasConfig)) {
        const toursIds = this.configurationService.getTours(arlasConfig);
        Object.keys(toursIds).forEach(lg => {
          this.persistenceService.updateResource(toursIds[lg], resourcesGroups.readers, resourcesGroups.writers, undefined, options);
        });
      }
    }
  }

  private getOptionsSetOrg(org: string) {
    return this.persistenceService.getOptionsSetOrg(org);
  }

  public close() {
    this.updateEmitter.emit([true, {}]);
  }

  public changeReader(changeValue, group: PersistenceGroup) {
    group.reader = changeValue.checked;
  }
  public changeWriter(changeValue, group: PersistenceGroup) {
    group.writer = changeValue.checked;
  }
}
