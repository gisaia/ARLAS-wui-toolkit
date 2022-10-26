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

import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';

export class PaginatorI18n implements MatPaginatorIntl {

  public changes: Subject<void>;
  public itemsPerPageLabel: string;
  public nextPageLabel: string;
  public previousPageLabel: string;
  public firstPageLabel: string;
  public lastPageLabel: string;

  public constructor(private readonly translate: TranslateService) {
    this.itemsPerPageLabel = this.translate.instant('ITEMS_PER_PAGE_LABEL');
    this.nextPageLabel = this.translate.instant('NEXT_PAGE_LABEL');
    this.previousPageLabel = this.translate.instant('PREVIOUS_PAGE_LABEL');
    this.firstPageLabel = this.translate.instant('FIRST_PAGE_LABEL');
    this.lastPageLabel = this.translate.instant('LAST_PAGE_LABEL');
    this.changes = new Subject();
  }

  public getRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0 || pageSize === 0) {
      return this.translate.instant('RANGE_PAGE_LABEL_1', { length });
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return this.translate.instant('RANGE_PAGE_LABEL_2', { startIndex: startIndex + 1, endIndex, length });
  }
}
