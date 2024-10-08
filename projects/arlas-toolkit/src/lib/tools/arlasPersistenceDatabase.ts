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

import { BehaviorSubject, catchError, map, mergeMap, Observable, of } from 'rxjs';
import { ArlasStorageObject } from './utils';
import { PersistenceService } from '../services/persistence/persistence.service';
import { DataResource, DataWithLinks } from 'arlas-persistence-api';

export class ArlasPersistenceDatabase<T extends ArlasStorageObject> {
  /** Stream that emits whenever the data has been modified. */
  public dataChange: BehaviorSubject<{ total: number; items: T[]; }>
    = new BehaviorSubject<{ total: number; items: T[]; }>({ total: 0, items: [] });
  public get data(): { total: number; items: T[]; } {
    return this.dataChange.value;
  }
  public storageObjectMap: Map<string, T> = new Map<string, T>();


  public storageKey: string;
  public persistenceService: PersistenceService;
  public additionalObject: any;

  private page: { size: number; number: number; } = { size: 10, number: 1 };

  public constructor(storageKy: string = 'storage_object', persistenceService: PersistenceService, additionalObject?: any) {
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

  public add(storageObject: T): Observable<void> {
    return this.persistenceService.create(this.storageKey, storageObject.name, JSON.stringify(storageObject))
      .pipe(catchError(e => of(e)),
        mergeMap(
          result => {
            const newObj = storageObject;
            newObj['id'] = result.id;
            return this.persistenceService.update(result.id, JSON.stringify(newObj), (result as any).last_update_date);
          }
        ),
        mergeMap(
          (d) => this.list(this.page.size, this.page.number, 'desc')
        )
      );
  }

  public remove(id: string): Observable<void> {
    return this.persistenceService.delete(id).pipe(catchError(e => of(e)), mergeMap(result => {
      this.storageObjectMap.delete(id);
      return this.list(this.page.size, this.page.number, 'desc');
    }));
  }

  public list(size: number, page: number, order: string, key = undefined): Observable<void> {
    return this.persistenceService.list(this.storageKey, size, page, order, key)
      .pipe(catchError(e => of(e)), map((dataResource: DataResource) => {
        const copiedData = [];
        let total = 0;
        if (dataResource.count > 0) {
          Array.from(dataResource.data).forEach((obj: DataWithLinks) => {
            const newObj: T = this.init(JSON.parse(obj.doc_value) as T, this.additionalObject);
            copiedData.push(newObj);
            this.storageObjectMap.set(newObj.id, newObj);
          });
          total = dataResource.total;
        }
        this.dataChange.next({ total: total, items: copiedData as T[] });
      }));
  }

  public update(id: string, storageObject: T): Observable<void> {
    return this.persistenceService.get(id)
      .pipe(mergeMap(s => this.persistenceService.update(id, JSON.stringify(storageObject), (s.last_update_date as any))
        .pipe(catchError(e => of(e)), mergeMap((result =>
          this.list(this.page.size, this.page.number, 'desc')
        )))));

  }

  public setPage(page: { size: number; number: number; }) {
    this.page = page;
  }

}
