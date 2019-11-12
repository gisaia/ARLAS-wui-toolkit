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
import { ArlasStartupService } from '../startup/startup.service';
import { MapContributor, TopoMapContributor } from 'arlas-web-contributors';
import { Expression } from 'arlas-api';

@Injectable()
export class ArlasMapSettings implements MapSettingsService {

  public MAPCONTRIBUTOR_ID = 'mapbox';
  public TOPOMAPCONTRIBUTOR_ID = 'topo_mapbox';

  public mapContributor: MapContributor | TopoMapContributor;

  constructor(public startUpService: ArlasStartupService) {
    const topoMapContributor = this.startUpService.contributorRegistry.get(this.TOPOMAPCONTRIBUTOR_ID);
    if (topoMapContributor) {
      this.mapContributor = <TopoMapContributor>topoMapContributor;
    } else {
      this.mapContributor = <MapContributor>this.startUpService.contributorRegistry.get(this.MAPCONTRIBUTOR_ID);
    }
  }

  public getAllGeometries(): Array<GeometrySelectModel> {
    const geoFields = this.mapContributor.geoPointFields.concat(this.mapContributor.geoShapeFields);
    const allDisplayGeometries = new Array<GeometrySelectModel>();
    if (geoFields) {
      const returnedGeometriesSet = this.mapContributor.getReturnedGeometries(this.mapContributor.returned_geometries);
      geoFields.forEach(geoField => {
        allDisplayGeometries.push({
          path: geoField,
          selected: returnedGeometriesSet.has(geoField)
        });
      });
    }
    return allDisplayGeometries;
  }

  public getClusterGeometries(): Array<GeometrySelectModel> {
    const clusterDisplayGeometries = new Array<GeometrySelectModel>();
    if (this.mapContributor.geoPointFields) {
      this.mapContributor.geoPointFields.forEach(geoPointField => {
        clusterDisplayGeometries.push({
          path: geoPointField,
          selected: geoPointField === this.mapContributor.aggregationField
        });
      });
    }
    return clusterDisplayGeometries;
  }

  public getFilterGeometries(): Array<GeometrySelectModel> {
    const geoFields = this.mapContributor.geoPointFields.concat(this.mapContributor.geoShapeFields);
    const filterGeometries = new Array<GeometrySelectModel>();
    if (geoFields) {
      geoFields.forEach(geoField => {
        filterGeometries.push({
          path: geoField,
          selected: geoField === this.mapContributor.geoQueryField
        });
      });
    }
    return filterGeometries;
  }

  public getOperations(): Array<OperationSelectModel> {
    return [
      {
        operation: Expression.OpEnum.Within.toString(),
        selected: Expression.OpEnum.Within === this.mapContributor.geoQueryOperation
      },
      {
        operation: Expression.OpEnum.Notwithin.toString(),
        selected: Expression.OpEnum.Notwithin === this.mapContributor.geoQueryOperation
      },
      {
        operation: Expression.OpEnum.Intersects.toString(),
        selected: Expression.OpEnum.Intersects === this.mapContributor.geoQueryOperation
      },
      {
        operation: Expression.OpEnum.Notintersects.toString(),
        selected: Expression.OpEnum.Notintersects === this.mapContributor.geoQueryOperation
      }
    ];
  }

  public hasFeaturesMode(): boolean {
    return (this.mapContributor instanceof MapContributor);
  }

  public hasTopologyMOde(): boolean {
    return (this.mapContributor instanceof TopoMapContributor);

  }
}
