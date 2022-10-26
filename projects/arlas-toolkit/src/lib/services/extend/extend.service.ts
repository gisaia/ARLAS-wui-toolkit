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
import { PersistenceService } from '../persistence/persistence.service';
import { ArlasStartupService } from '../startup/startup.service';
import { ExtendLocalDatabase } from './extendLocalDatabase';
import { ExtendPersistenceDatabase } from './extendPersistenceDatabase';
import { Extend } from './model';
import { Observable } from 'rxjs';
import { AuthentificationService } from '../authentification/authentification.service';

@Injectable()
export class ArlasExtendService {
  public dataBase: ExtendLocalDatabase | ExtendPersistenceDatabase;
  public extendMap: Map<string, Extend> = new Map<string, Extend>();

  public constructor(
    private arlasStartupService: ArlasStartupService,
    private authentService: AuthentificationService,
    private persistenceService: PersistenceService) {
    if (this.arlasStartupService.shouldRunApp && !this.arlasStartupService.emptyMode) {
      if (this.persistenceService.isAvailable && this.authentService.hasValidAccessToken() && this.authentService.hasValidIdToken()) {
        this.dataBase = new ExtendPersistenceDatabase(this.persistenceService);
        this.dataBase.dataChange.subscribe(() => {
          this.extendMap = this.dataBase.storageObjectMap;
        });
      } else {
        this.dataBase = new ExtendLocalDatabase();
        this.dataBase.dataChange.subscribe(() => {
          this.extendMap = this.dataBase.storageObjectMap;
        });
      }
    }
  }

  public init(extend: Extend): Extend {
    const initExtend = {
      id: extend.id,
      date: new Date(extend.date),
      name: extend.name,
      geometry: extend.geometry,
      private: extend.private
    };
    return initExtend;
  }

  /**
 * List all bookmark for the user to update dataBase
 */
  public listExtends(size: number, pageNumber: number): Observable<void> {
    return (this.dataBase as ExtendPersistenceDatabase).list(size, pageNumber, 'desc');
  }

  public setPage(size: number, pageNumber: number) {
    (this.dataBase as ExtendPersistenceDatabase).setPage({ size: size, number: pageNumber });
  }

  public addExtend(name: string, geometry: any): Observable<void>{
    const newExtend = this.dataBase.createExtend(name, geometry);
    return this.dataBase.add(newExtend);
  }

  public removeExtend(id: string): Observable<void> {
    return this.dataBase.remove(id);
  }

  public getExtendById(id: string): Extend {
    return Array.from(this.extendMap.values()).find(extend => extend.id === id);
  }
}
