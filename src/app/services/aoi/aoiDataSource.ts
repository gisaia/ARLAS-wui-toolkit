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

import { DataSource } from '@angular/cdk/table';
import { Aoi } from './model';
import { map } from 'rxjs/operators';
import { AoiDatabase } from './aoiDatabase';
import { BehaviorSubject, Observable, merge } from 'rxjs';

export class AoiDataSource extends DataSource<any> {
  private _filterChange = new BehaviorSubject('');
  get filter(): string { return this._filterChange.value; }
  set filter(filter: string) { this._filterChange.next(filter); }
  constructor(private aoiDatabase: AoiDatabase) {
    super();
  }
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  public connect(): Observable<Aoi[]> {
    const displayDataChanges = [
      this.aoiDatabase.dataChange,
      this._filterChange


    ];
    return merge(...displayDataChanges).pipe(map(() => {
      localStorage.setItem('aoi', JSON.stringify(this.aoiDatabase.data));
      return this.getData();

    }));
  }

  public disconnect() { }

  private getData(): Aoi[] {
    return this.aoiDatabase.data.slice();
  }
}
