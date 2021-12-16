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

import { ArlasDataSource } from '../../tools/arlasDataSource';
import { BookMark } from './model';
import { BookmarkLocalDatabase } from './bookmarkLocalDatabase';


export class BookmarkDataSource extends ArlasDataSource {

  constructor(public dataBase: BookmarkLocalDatabase) {
    super(dataBase);
  }

  public getSortedData(): BookMark[] {
    const data = this.dataBase.data.slice();
    // force date asc sort
    const sortedData = this.sortOnDate(data);
    return sortedData.slice().filter((item: BookMark) => {
      if (item.name !== undefined) {
        const searchStr = (item.name + ' ' + item.collections).toLowerCase();
        return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
      }
    });

  }

  public sortOnDate(data: BookMark[]): BookMark[] {
    const sortedData = data.sort((a, b) => {
      let propertyA: number = new Date(0).getTime();
      let propertyB: number = new Date(0).getTime();
      [propertyA, propertyB] = [a.date.getTime(), b.date.getTime()];
      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (-1);
    });
    return sortedData;
  }
}
