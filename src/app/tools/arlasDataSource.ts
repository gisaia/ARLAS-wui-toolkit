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

import { Observable, merge, BehaviorSubject } from 'rxjs';
import { DataSource } from '@angular/cdk/collections';
import { ArlasLocalDatabase } from './arlasLocalDatabase';
import { sortOnDate, ArlasStorageObject } from './utils';
import { map } from 'rxjs/operators';

export class ArlasDataSource extends DataSource<any> {
  private _filterChange = new BehaviorSubject('');
  get filter(): string { return this._filterChange.value; }
  set filter(filter: string) { this._filterChange.next(filter); }
  constructor(public arlasLocalDatabase: ArlasLocalDatabase<ArlasStorageObject>) {
    super();
  }
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  public connect(): Observable<ArlasStorageObject[]> {
    const displayDataChanges = [
      this.arlasLocalDatabase.dataChange,
      this._filterChange


    ];
    return merge(...displayDataChanges).pipe(map(() => {
      localStorage.setItem(this.arlasLocalDatabase.storageKey, JSON.stringify(this.arlasLocalDatabase.data));
      return this.getSortedData();

    }));
  }

  public disconnect() { }
  public getSortedData(): ArlasStorageObject[] {
    const data = this.arlasLocalDatabase.data.slice();
    // force date asc sort
    const sortedData = sortOnDate(data);
    return sortedData.slice().filter((item: ArlasStorageObject) => {
      if (item.name !== undefined) {
        const searchStr = (item.name).toLowerCase();
        return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
      }
    });

  }
}
