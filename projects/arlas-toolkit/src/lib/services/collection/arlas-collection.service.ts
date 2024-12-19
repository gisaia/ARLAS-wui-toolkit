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
import { BaseCollectionService } from 'arlas-web-components';
import { CollectionUnit, flattenData } from '../../tools/utils';
import { ArlasCollaborativesearchService } from '../collaborative-search/arlas.collaborative-search.service';
import { ArlasConfigService, ArlasStartupService } from '../startup/startup.service';

@Injectable()
export class ArlasCollectionService extends BaseCollectionService {
  private appUnits: Map<string, CollectionUnit> = new Map();
  private displayName: Map<string, string> = new Map();
  public displayFieldName: Map<string, string> = new Map();
  public FLAT_CHAR = '_';
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

  protected _initDisplayNames() {
    if (this.arlasStartupeService.shouldRunApp) {
      for (const key of this.arlasStartupeService.collectionsMap.keys()) {
        const c = this.arlasStartupeService.collectionsMap.get(key);
        this.displayName.set(key, c?.display_names?.collection ?? key);
        const fields = c?.display_names?.fields;
        if (fields) {
          for (const f of Object.keys(fields)) {
            this.displayFieldName.set(this.flatten(f), c?.display_names?.fields[f]);
          }
        }
      }
    }
  }

  public getUnit(collectionName: string): string {
    if (this.appUnits.has(collectionName)) {
      return this.appUnits.get(collectionName).unit;
    }
    return collectionName;
  };

  public getAllUnits(): CollectionUnit[] {
    return [...this.appUnits.values()];
  };

  public getDisplayName(collectionName: string): string {
    return this.displayName.get(collectionName) || collectionName;
  }

  public getDisplayFieldName(fieldName: string): string {
    return this.displayFieldName.get(this.flatten(fieldName)) || this.flatten(fieldName);
  }

  public isUnitIgnored(collectionName: string): boolean {
    if (this.appUnits.has(collectionName)) {
      return this.appUnits.get(collectionName).ignored;
    }
    return false;
  }
  // Retrieve all collections used in a dashboards
  public getCollectionFromDashboard(config: any): Set<string> {
    const flattenedConfig = flattenData(config);
    const collections = new Set<string>();
    Object.keys(flattenedConfig)
      .filter(k =>
        (k.indexOf('collection') >= 0 || (k.indexOf('additionalCollections') >= 0 && k.indexOf('collectionName') >= 0))
        &&
        !k.includes('collection-display-name')
        &&
        !k.includes('collectionDisplayName')

      )
      .forEach(k => collections.add(flattenedConfig[k]));
    return collections;
  }

  public flatten(f: string): string {
    return f?.replace(/\./g, this.FLAT_CHAR);
  }
}
