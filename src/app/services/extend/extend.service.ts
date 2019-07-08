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
import { ExtendDatabase } from './extendDatabase';
import { Extend } from './model';
import { ArlasStartupService } from '../startup/startup.service';

@Injectable({
  providedIn: 'root'
})
export class ArlasExtendService {
  public dataBase: ExtendDatabase;
  public extendMap: Map<string, Extend> = new Map<string, Extend>();

  constructor(private arlasStartupService: ArlasStartupService) {
    if (this.arlasStartupService.shouldRunApp) {
      this.dataBase = new ExtendDatabase();
      this.extendMap = this.dataBase.storageObjectMap;
    }
  }

  public addExtend(name: string, geometry: any) {
    const newExtend = this.dataBase.createExtend(name, geometry);
    this.dataBase.add(newExtend);
    this.extendMap = this.dataBase.storageObjectMap;
  }

  public removeExtend(id: string) {
    this.dataBase.remove(id);
    this.extendMap = this.dataBase.storageObjectMap;
  }

  public getExtendById(id: string): Extend {
    return Array.from(this.extendMap.values()).find(extend => extend.id === id);
  }
}
