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

import { BehaviorSubject } from 'rxjs';
import { sortOnDate, ArlasStorageObject } from './utils';

export class ArlasLocalDatabase<T extends ArlasStorageObject> {
  /** Stream that emits whenever the data has been modified. */
  public dataChange: BehaviorSubject<T[]> = new BehaviorSubject<T[]>([]);
  public get data(): T[] {
    return this.dataChange.value;
  }
  public storageObjectMap: Map<string, T> = new Map<string, T>();

  public storageKey: string;

  public constructor(storageKey: string = 'storage_object', additionalObject?: any) {
    this.storageKey = storageKey;

    if (localStorage.getItem(this.storageKey) !== null) {
      const copiedData = [];
      Array.from(JSON.parse(localStorage.getItem(this.storageKey))).forEach((obj: T) => {
        const newObj: T = this.init(obj, additionalObject);
        copiedData.push(newObj);
        this.storageObjectMap.set(obj.id, newObj);
      });
      const sortedData = sortOnDate(copiedData);
      this.dataChange.next((sortedData as T[]));
    }
  }

  /**
   * Method call for each element at init
   * @param obj Object to init of type <T>
   * @param additionnalObj Addtionnal object
   */
  public init(obj: T, additionnalObj?: any): T {
    return obj;
  }

  public add(storageObject: T) {
    const copiedData = this.data.slice();
    copiedData.push(storageObject);
    this.storageObjectMap.set(storageObject.id, storageObject);
    const sortedData = sortOnDate(copiedData);
    localStorage.setItem(this.storageKey, JSON.stringify(sortedData));
    this.dataChange.next((sortedData as T[]));
  }

  public remove(id: string) {
    const copiedData = this.data.slice();
    const newData = [];
    copiedData.forEach((u: T) => {
      if (u.id !== id) {
        newData.push(u);
      }
    });
    this.storageObjectMap.delete(id);
    this.dataChange.next(newData);
  }

  public update(id: string, storageObject: T) {
    this.remove(id);
    this.add(storageObject);
  }

}
