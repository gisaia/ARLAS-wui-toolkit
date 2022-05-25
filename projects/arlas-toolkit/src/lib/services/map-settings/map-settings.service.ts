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
import { MapSettingsService, GeometrySelectModel, OperationSelectModel } from 'arlas-web-components';
import { ArlasStartupService, ArlasConfigService } from '../startup/startup.service';
import { MapContributor } from 'arlas-web-contributors';
import { Expression } from 'arlas-api';
import { Contributor } from 'arlas-web-core';

@Injectable()
export class ArlasMapSettings implements MapSettingsService {

  public mapContributors: MapContributor[] = [];

  public constructor(public startUpService: ArlasStartupService) {
    this.mapContributors = Array.from(this.startUpService.contributorRegistry.values())
      .filter((c: Contributor) => c instanceof MapContributor)
      .map(c => c as MapContributor);
  }

  public getGeoQueries(): Map<string, [GeometrySelectModel[], OperationSelectModel[], string]> {
    const geoQueriesMap = new Map<string, [GeometrySelectModel[], OperationSelectModel[], string]>();
    this.mapContributors.forEach(mc => {
      const displayCollectionName = !!this.startUpService.collectionsMap.get(mc.collection).display_names?.collection ?
        this.startUpService.collectionsMap.get(mc.collection).display_names?.collection : mc.collection;
      geoQueriesMap.set(mc.collection, [this.getFilterGeometries(mc), this.getOperations(mc) , displayCollectionName]);
    });
    return geoQueriesMap;
  }

  private getFilterGeometries(mapContributor: MapContributor): Array<GeometrySelectModel> {
    const filterGeometries = new Array<GeometrySelectModel>();
    if (mapContributor) {
      const geoFields = mapContributor.geoPointFields.concat(mapContributor.geoShapeFields);
      if (geoFields) {
        geoFields.forEach(geoField => {
          filterGeometries.push({
            path: geoField,
            selected: geoField === mapContributor.geoQueryField
          });
        });
      }
    }
    return filterGeometries;
  }

  private getOperations(mapContributor: MapContributor): Array<OperationSelectModel> {
    if (mapContributor) {
      return [
        {
          operation: Expression.OpEnum.Within.toString(),
          selected: Expression.OpEnum.Within === mapContributor.geoQueryOperation
        },
        {
          operation: Expression.OpEnum.Notwithin.toString(),
          selected: Expression.OpEnum.Notwithin === mapContributor.geoQueryOperation
        },
        {
          operation: Expression.OpEnum.Intersects.toString(),
          selected: Expression.OpEnum.Intersects === mapContributor.geoQueryOperation
        },
        {
          operation: Expression.OpEnum.Notintersects.toString(),
          selected: Expression.OpEnum.Notintersects === mapContributor.geoQueryOperation
        }
      ];
    }
    return [];
  }
}
