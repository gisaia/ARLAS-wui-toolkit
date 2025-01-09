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

import { Component, Output } from '@angular/core';
import { ArlasExtendService } from '../../services/extend/extend.service';
import { Subject } from 'rxjs';
import { Extend } from '../../services/extend/model';
import { ArlasDataSource } from '../../tools/arlasDataSource';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ExtendPersistenceDatabase } from '../../services/extend/extendPersistenceDatabase';
import { ExtendLocalDatabase } from '../../services/extend/extendLocalDatabase';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable
} from '@angular/material/table';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatIcon } from '@angular/material/icon';
import { DatePipe, NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'arlas-extend',
  templateUrl: './extend.component.html',
  styleUrls: ['./extend.component.css'],
  standalone: true,
  imports: [MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell,
    MatCheckbox, MatIcon, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, NgIf,
    MatPaginator, DatePipe, TranslateModule]
})
export class ExtendComponent {

  public extends: ArlasDataSource | Extend[];
  public columnsToDisplay = ['checked', 'name', 'date', 'actions'];
  public itemsCheck: Array<string> = new Array<string>();

  public resultsLength = 0;
  public pageSize = 10;
  public pageNumber = 1;

  public isPersistenceActive = false;

  @Output() public actions: Subject<{ action: string; id: string; geometry?: any; }> = new Subject<any>();

  public constructor(
    private extendService: ArlasExtendService
  ) {
    // Init component with data from persistence server, if defined and server is reachable
    if (this.extendService.dataBase instanceof ExtendPersistenceDatabase) {
      this.isPersistenceActive = true;
      this.extendService.setPage(this.pageSize, this.pageNumber);
      this.getExtendsList();
      (this.extendService.dataBase as ExtendPersistenceDatabase).dataChange
        .subscribe((data: { total: number; items: Extend[]; }) => {
          this.resultsLength = data.total;
          this.extends = data.items;
        });
    } else {
      this.extends = new ArlasDataSource(this.extendService.dataBase as ExtendLocalDatabase);
    }
  }

  public getExtendsList() {
    this.extendService.listExtends(this.pageSize, this.pageNumber).subscribe(()=>{},(e)=> console.error(e));
  }

  public pageChange(pageEvent: PageEvent) {
    this.pageNumber = pageEvent.pageIndex;
    this.pageSize = pageEvent.pageSize;
    this.extendService.setPage(this.pageSize, this.pageNumber);
    this.getExtendsList();
  }

  public selectExtend(event: { checked: boolean; }, id: string) {
    if (event.checked) {
      this.itemsCheck.push(id);
    } else {
      const index = this.itemsCheck.indexOf(id, 0);
      if (index > -1) {
        this.itemsCheck.splice(index, 1);
      }
    }
  }

  public viewExtend(id: string) {
    const extend: Extend = this.extendService.getExtendById(id);
    this.actions.next({ action: 'view', id: id, geometry: extend.geometry });

  }

  public removeExtend(id: string) {
    this.extendService.removeExtend(id).subscribe(()=>{
      this.selectExtend({ checked: false }, id);
      this.actions.next({ action: 'remove', id: id });
    },(e)=> console.error(e));
  }
}
