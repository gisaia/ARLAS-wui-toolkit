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
import { ArlasStorageObject } from './utils';
import { PersistenceService } from '../services/persistence/persistence.service';
import { DataResource } from 'arlas-persistence-api';

export class ArlasPersistenceDatabase<T extends ArlasStorageObject> {
  /** Stream that emits whenever the data has been modified. */
  public dataChange: BehaviorSubject<{ total: number, items: T[] }>
    = new BehaviorSubject<{ total: number, items: T[] }>({ total: 0, items: [] });
  get data(): { total: number, items: T[] } { return this.dataChange.value; }
  public storageObjectMap: Map<string, T> = new Map<string, T>();
  // persistenceIdMap : first => <T> id | second => persistenceObject id
  public persistenceIdMap: Map<string, string> = new Map<string, string>();

  public storageKey: string;
  public persistenceService: PersistenceService;
  public additionalObject: any;


  constructor(storageKy: string = 'storage_object', persistenceService: PersistenceService, additionalObject?: any) {
    this.storageKey = storageKy;
    this.persistenceService = persistenceService;
    this.additionalObject = additionalObject;
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
    this.persistenceService.create(this.storageKey, JSON.stringify(storageObject)).subscribe(result => {
      this.list(10, 1, 'desc');
    });
  }

  public remove(id: string) {
    this.persistenceService.delete(this.persistenceIdMap.get(id)).subscribe(result => {
      this.storageObjectMap.delete(id);
      this.persistenceIdMap.delete(id);
      this.list(10, 1, 'desc');
    });
  }

  public list(size: number, page: number, order: string) {
    this.persistenceService.list(this.storageKey, size, page, order).subscribe((dataResource: DataResource) => {

      const copiedData = [];
      if (dataResource.count > 0) {
        Array.from(dataResource.data).forEach((obj: any) => {
          const newObj: T = this.init(JSON.parse(obj.docValue) as T, this.additionalObject);
          copiedData.push(newObj);
          this.storageObjectMap.set(newObj.id, newObj);
          this.persistenceIdMap.set(newObj.id, obj.id);
        });
        this.dataChange.next({ total: dataResource.total, items: copiedData as T[] });
      }
    });
  }

  public update(id: string, storageObject: T) {
    this.persistenceService.update(this.persistenceIdMap.get(id), JSON.stringify(storageObject)).subscribe(result => {
      this.list(10, 1, 'desc');
    });
  }

}
