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

import { CollectionUnit } from '../../tools/utils';
import { BaseCollectionService } from 'arlas-web-components';
import { Injectable } from '@angular/core';
import { ArlasCollaborativesearchService, ArlasConfigService, ArlasStartupService } from '../startup/startup.service';

@Injectable()
export class ArlasCollectionService extends BaseCollectionService {
  private appUnits: Map<string, CollectionUnit> = new Map();
  private displayName: Map<string, string> = new Map();
  public constructor(private collaborativeService: ArlasCollaborativesearchService,
                     private configService: ArlasConfigService,
                     private arlasStartupeService: ArlasStartupService
  ) {
    super();
    this._initUnits();
    this._initDisplayNames();
  }

  protected _initUnits() {
    const appUnits = this.configService.getValue('arlas-wui.web.app.units') ?
      this.configService.getValue('arlas-wui.web.app.units') : [];
    appUnits.forEach((collectionUnit: CollectionUnit) => this.appUnits.set(collectionUnit.collection, collectionUnit));
    /** retrocompatibility code for unit*/
    const appUnit = this.configService.getValue('arlas-wui.web.app.unit');
    if (appUnit || appUnits.length === 0) {
      const collectionUnit = {
        collection: this.collaborativeService.defaultCollection,
        unit: !!appUnit ? appUnit : this.collaborativeService.defaultCollection,
        ignored: false
      };
      this.appUnits.set(collectionUnit.collection, collectionUnit);
    }
    /** end of retrocompatibility code */
  }

  protected _initDisplayNames(){
    if(this.arlasStartupeService.shouldRunApp){
      for(const key of this.arlasStartupeService.collectionsMap.keys()) {
        const c = this.arlasStartupeService.collectionsMap.get(key);
        this.displayName.set(key, c?.display_names?.collection ?? key);
      }
    }
  }
  
  public getUnit(collectionName: string): string | null {
    if (this.appUnits.has(collectionName)) {
      return this.appUnits.get(collectionName).unit;
    }
    return null;
  };

  public getAllUnits(): CollectionUnit[] {
    return [...this.appUnits.values()];
  };

  public getDisplayName(collectionName: string): string | undefined {
    return this.displayName.get(collectionName) || collectionName;
  }
}
