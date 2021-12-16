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
import { Guid } from '../../tools/utils';
import { ArlasLocalDatabase } from '../../tools/arlasLocalDatabase';

export class AoiDatabase extends ArlasLocalDatabase<Aoi> {

  constructor() {
    super('aoi');
  }

  public init(aoi: Aoi): Aoi {
    const initAoi = {
      id: aoi.id,
      date: new Date(aoi.date),
      name: aoi.name,
      geometry: aoi.geometry,
      private: aoi.private
    };
    return initAoi;
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

}
