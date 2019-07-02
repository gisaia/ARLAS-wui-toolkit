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

import { Aoi } from './model';
import { BehaviorSubject } from 'rxjs';

export class AoiDatabase {
  public dataChange: BehaviorSubject<Aoi[]> = new BehaviorSubject<Aoi[]>([]);
  get data(): Aoi[] { return this.dataChange.value; }
  public aoiMap: Map<string, Aoi> = new Map<string, Aoi>();
  constructor() {
    if (localStorage.getItem('aoi') !== null) {
      const aoiItems = [];
      Array.from(JSON.parse(localStorage.getItem('aoi'))).forEach((aoi: Aoi) => {
        const currentAoi = this.createAoi(aoi.name, aoi.geometry, aoi.private, aoi.date, aoi.id);
        aoiItems.push(currentAoi);
        this.aoiMap.set(aoi.id, currentAoi);
      });
      this.dataChange.next(aoiItems);
    }
  }

  public createAoi(name: string, geometry: any, visibility: boolean = false, date?: Date, id?: string): Aoi {
    let uid = '';
    let aoiDate: Date;

    if (id) {
      uid = id;
    } else {
      const guid = new Guid();
      uid = guid.newGuid();
    }
    if (date) {
      aoiDate = new Date(date);
    } else {
      aoiDate = new Date();
    }
    const aoi: Aoi = {
      id: uid,
      date: aoiDate,
      name: name,
      geometry: geometry,
      private: visibility
    };
    return aoi;
  }

  public addAoi(aoi: Aoi) {
    const aoiItems = this.data.slice();
    aoiItems.push(aoi);
    this.aoiMap.set(aoi.id, aoi);
    localStorage.setItem('aoi', JSON.stringify(aoiItems));
    this.dataChange.next(aoiItems);
  }

  public removeAoi(id: string) {
    const aoiItems = this.data.slice();
    const newData = aoiItems.filter(u => u.id !== id);
    this.aoiMap.delete(id);
    this.dataChange.next(newData);
  }

}

export class Guid {
  public newGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}
