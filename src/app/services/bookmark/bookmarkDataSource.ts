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

import { Observable } from 'rxjs/Observable';
import { BookMark } from './model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DataSource } from '@angular/cdk/collections';
import { BookmarkDatabase } from './bookmarkDatabase';
import { sortOnDate } from './utils';

export class BookmarkDataSource extends DataSource<any> {
  private _filterChange = new BehaviorSubject('');
  get filter(): string { return this._filterChange.value; }
  set filter(filter: string) { this._filterChange.next(filter); }
  constructor(private _bookmarkDatabase: BookmarkDatabase) {
    super();
  }
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  public connect(): Observable<BookMark[]> {
    const displayDataChanges = [
      this._bookmarkDatabase.dataChange,
      this._filterChange


    ];
    return Observable.merge(...displayDataChanges).map(() => {
      localStorage.setItem('bookmark', JSON.stringify(this._bookmarkDatabase.data));
      return this.getSortedData();

    });
  }

  public disconnect() { }
  private getSortedData(): BookMark[] {
    const data = this._bookmarkDatabase.data.slice();
    // force date asc sort
    const sortedData = sortOnDate(data);
    return sortedData.slice().filter((item: BookMark) => {
      if (item.name !== undefined) {
        const searchStr = (item.name).toLowerCase();
        return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
      }
    });

  }
}
