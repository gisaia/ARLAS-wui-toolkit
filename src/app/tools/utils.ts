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

import { Filter } from 'arlas-api';

export interface ArlasStorageObject {
  id: string;
  date: Date;
  name: string;
}

export function hashCode(str) { // java String#hashCode
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

export function intToRGB(i) {
  const c = (i & 0x00FFFFFF)
      .toString(16)
      .toUpperCase();
  return '00000'.substring(0, 6 - c.length) + c;
}

export class Guid {
  public newGuid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
          const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
      });
  }
}

export function sortOnDate(data: ArlasStorageObject[]): ArlasStorageObject[] {
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

export function getKeyForColor(dataModel: Object): string {
    const finalKeys: string[] = [];
    Object.keys(dataModel).forEach(k => {
        const key = [];
        if ((<Filter>dataModel[k].filter).f !== undefined) {
            (<Filter>dataModel[k].filter).f
                .forEach(e => e
                    .forEach(ex => {
                        if (key.indexOf('f' + ex.field + ex.op) < 0) {
                            key.push('f' + ex.field + ex.op);
                        }
                    }));
        }
        if ((<Filter>dataModel[k].filter).q !== undefined) {
            if (key.indexOf('q') < 0) {
                key.push('q');
            }
        }
        // if ((<Filter>dataModel[k].filter).gintersect !== undefined) {
        //     if (key.indexOf('gintersect') < 0) {
        //         key.push('gintersect');
        //     }
        // }
        // if ((<Filter>dataModel[k].filter).gwithin !== undefined) {
        //     if (key.indexOf('gwithin') < 0) {
        //         key.push('gwithin');
        //     }
        // }
        // if ((<Filter>dataModel[k].filter).notgintersect !== undefined) {
        //     if (key.indexOf('notgintersect') < 0) {
        //         key.push('notgintersect');
        //     }
        // }
        // if ((<Filter>dataModel[k].filter).notgwithin !== undefined) {
        //     if (key.indexOf('notgwithin') < 0) {
        //         key.push('notgwithin');
        //     }
        // }
        // if ((<Filter>dataModel[k].filter).notpwithin !== undefined) {
        //     if (key.indexOf('notpwithin') < 0) {
        //         key.push('notpwithin');
        //     }
        // }
        // if ((<Filter>dataModel[k].filter).pwithin !== undefined) {
        //     if (key.indexOf('pwithin') < 0) {
        //         key.push('pwithin');
        //     }
        // }
        finalKeys.push(key.sort().join(','));
    });
    return intToRGB(hashCode(finalKeys.sort().join(',')));
}
