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

import { Filter } from 'arlas-api';
import { OverlayRef } from '@angular/cdk/overlay';
import { InjectionToken } from '@angular/core';

export const CONFIG_ID_QUERY_PARAM = 'config_id';

export interface ConfigAction {
  type: ConfigActionEnum;
  enabled?: boolean;
  name?: string;
  url?: string;
  configIdParam?: string;
  config: Config;
}

export interface Config {
  id: string;
  name: string;
  value: string;
  lastUpdate: number;
  readers: Array<string>;
  writers: Array<string>;
  zone: string;
}

export enum ConfigActionEnum {
  VIEW,
  DELETE,
  EDIT,
  DUPLICATE,
  SHARE,
  CREATE,
  RENAME
}

export interface ArlasStorageObject {
  id: string;
  date: Date;
  name: string;
}

export enum ArlasStorageType {
  local,
  persistence
}

export interface SpinnerOptions {
  color?: string;
  diameter?: number;
  strokeWidth?: number;
}

export interface CollectionUnit {
  collection: string;
  unit: string;
  ignored: boolean;
}

export interface CollectionCount {
  count: number;
  collection: number;
  color: string;
  hasCentroidPath: boolean;
  ignored: boolean;
  unit?: string;
}

/**
 * This interface lists the possible methods to apply on a Map object of a given cartographic client
 */
export interface MapService {
  zoomToData(collection: string, geoPointField: string, map: any);
}

export function hashCode(str) { // java String#hashCode
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

export function intToRGB(i) {
  const c = (i & 0x00FFFFFF)
    .toString(16)
    .toUpperCase();
  return '00000'.substring(0, 6 - c.length) + c;
}

export class Guid {
  public newGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}

export function sortOnDate(data: ArlasStorageObject[]): ArlasStorageObject[] {
  const sortedData = data.sort((a, b) => {
    let propertyA: number = new Date(0).getTime();
    let propertyB: number = new Date(0).getTime();
    [propertyA, propertyB] = [a.date.getTime(), b.date.getTime()];
    const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
    const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

    return (valueA < valueB ? -1 : 1) * (-1);
  });
  return sortedData;
}

export function getKeyForColor(dataModel: Object): string {
  const finalKeys: string[] = [];
  Object.keys(dataModel).forEach(k => {
    const key = new Set();
    const dataModelFilters = dataModel[k].filters;
    if (!!dataModelFilters) {
      dataModelFilters.forEach((filters: Filter[], collection: string) => {
        filters.forEach(filter => {
          if (filter.f !== undefined) {
            filter.f.forEach(e => e
              .forEach(ex => {
                if (!key.has(collection + 'f' + ex.field + ex.op)) {
                  key.add('f' + ex.field + ex.op);
                }
              }));
          }
          if (filter.q !== undefined) {
            if (!key.has(collection + 'q')) {
              key.add(collection + 'q');
            }
          }
        });
      });

    }
    finalKeys.push(Array.from(key).sort().join(','));
  });
  return intToRGB(hashCode(finalKeys.sort().join(',')));
}

export function getFieldProperties(fieldList: any, parentPrefix?: string,
  arlasFields?: Array<{ label: string; type: string; hashField: string; }>, isFirstLevel?: boolean
): Array<{ label: string; type: string; hashField: string; }> {
  if (!arlasFields) {
    arlasFields = new Array();
  }
  if (isFirstLevel === undefined) {
    isFirstLevel = true;
  }
  Object.keys(fieldList).forEach(fieldName => {
    if (fieldList[fieldName].type === 'OBJECT') {
      const subFields = fieldList[fieldName].properties;
      if (subFields) {
        getFieldProperties(subFields, (parentPrefix ? parentPrefix : '') + fieldName + '.', arlasFields, false);
      }
    } else {
      arlasFields.push({
        label: (parentPrefix ? parentPrefix : '') + fieldName, type: fieldList[fieldName].type,
        hashField: fieldList[fieldName].hash_field
      });

    }
  });

  if (isFirstLevel) {
    return arlasFields;
  }
}

export class ArlasOverlayRef {
  public constructor(private overlayRef: OverlayRef) { }
  public close(): void {
    if (!!this.overlayRef) {
      this.overlayRef.dispose();
    }
  }
}
export const HISTOGRAM_TOOLTIP_DATA = new InjectionToken<any>('HISTOGRAM_TOOLTIP_DATA');
export const DONUT_TOOLTIP_DATA = new InjectionToken<any>('DONUT_TOOLTIP_DATA');
