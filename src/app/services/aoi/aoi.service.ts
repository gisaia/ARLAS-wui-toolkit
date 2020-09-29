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

import { Injectable } from '@angular/core';
import { AoiDatabase } from './aoiDatabase';
import { Aoi } from './model';
import { ArlasStartupService } from '../startup/startup.service';

@Injectable({
  providedIn: 'root'
})
export class ArlasAoiService {
  public dataBase: AoiDatabase;
  public aoiMap: Map<string, Aoi> = new Map<string, Aoi>();

  constructor(private arlasStartupService: ArlasStartupService) {
    if (this.arlasStartupService.shouldRunApp && !this.arlasStartupService.emptyMode) {
      this.dataBase = new AoiDatabase();
      this.aoiMap = this.dataBase.storageObjectMap;
    }
  }

  public addAoi(name: string, geometry: any) {
    const newAoi = this.dataBase.createAoi(name, geometry);
    this.dataBase.add(newAoi);
    this.aoiMap = this.dataBase.storageObjectMap;
  }

  public removeAoi(id: string) {
    this.dataBase.remove(id);
    this.aoiMap = this.dataBase.storageObjectMap;
  }

  public getAoiById(id: string): Aoi {
    return Array.from(this.aoiMap.values()).find(aoi => aoi.id === id);
  }
}
