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
import { MapContributor, TopoMapContributor } from 'arlas-web-contributors';
import { Expression } from 'arlas-api';

@Injectable()
export class ArlasMapSettings implements MapSettingsService {


  public MAPCONTRIBUTOR_ID = 'mapbox';
  public TOPOMAPCONTRIBUTOR_ID = 'topo_mapbox';
  public componentConfig;
  public mapContributor: MapContributor | TopoMapContributor;

  constructor(public startUpService: ArlasStartupService, private configService: ArlasConfigService) {
    const topoMapContributor = this.startUpService.contributorRegistry.get(this.TOPOMAPCONTRIBUTOR_ID);
    if (topoMapContributor) {
      this.mapContributor = <TopoMapContributor>topoMapContributor;
    } else {
      this.mapContributor = <MapContributor>this.startUpService.contributorRegistry.get(this.MAPCONTRIBUTOR_ID);
    }
    this.componentConfig = this.configService.getValue('arlas.web.components');
  }

  public getAllGeometries(): Array<GeometrySelectModel> {
    const geoFields = this.mapContributor.geoPointFields.concat(this.mapContributor.geoShapeFields);
    const allDisplayGeometries = new Array<GeometrySelectModel>();
    // if (geoFields) {
    //   const returnedGeometriesSet = this.mapContributor.getReturnedGeometries(this.mapContributor.returned_geometries);
    //   geoFields.forEach(geoField => {
    //     allDisplayGeometries.push({
    //       path: geoField,
    //       selected: returnedGeometriesSet.has(geoField)
    //     });
    //   });
    // }
    return allDisplayGeometries;
  }

  public getClusterGeometries(): Array<GeometrySelectModel> {
    const clusterDisplayGeometries = new Array<GeometrySelectModel>();

    if (this.componentConfig.mapgl_settings !== undefined) {
      if (this.componentConfig.mapgl_settings.exlude_geom_for_cluster !== undefined) {
        const excludeGeomList: Array<String> = this.componentConfig.mapgl_settings.exlude_geom_for_cluster;
        return clusterDisplayGeometries.filter(model => excludeGeomList.indexOf(model.path) < 0);
      } else {
        return clusterDisplayGeometries;
      }
    } else {
      return clusterDisplayGeometries;
    }
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

  public getFeatureGeometries(): GeometrySelectModel[] {
    const featureDisplayGeometries = this.getAllGeometries();
    if (this.componentConfig.mapgl_settings !== undefined) {
      if (this.componentConfig.mapgl_settings.exlude_geom_for_features !== undefined) {
        const excludeGeomList: Array<String> = this.componentConfig.mapgl_settings.exlude_geom_for_features;
        return featureDisplayGeometries.filter(model => excludeGeomList.indexOf(model.path) < 0);
      } else {
        return featureDisplayGeometries;
      }
    } else {
      return featureDisplayGeometries;
    }
  }
  public getTopologyGeometries(): GeometrySelectModel[] {
    const topologyDisplayGeometries = this.getAllGeometries();
    if (this.componentConfig.mapgl_settings !== undefined) {
      if (this.componentConfig.mapgl_settings.exlude_geom_for_topology !== undefined) {
        const excludeGeomList: Array<String> = this.componentConfig.mapgl_settings.exlude_geom_for_topology;
        return topologyDisplayGeometries.filter(model => excludeGeomList.indexOf(model.path) < 0);
      } else {
        return topologyDisplayGeometries;
      }
    } else {
      return topologyDisplayGeometries;
    }
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
    let hasFeaturesMode = !(this.mapContributor instanceof TopoMapContributor);
    if (this.componentConfig.mapgl_settings !== undefined) {
      if (this.componentConfig.mapgl_settings.has_features_mode !== undefined) {
        hasFeaturesMode = this.componentConfig.mapgl_settings.has_features_mode;
      }
    }
    return hasFeaturesMode;
  }

  public hasTopologyMode(): boolean {
    let hasTopologyMode = (this.mapContributor instanceof TopoMapContributor);
    if (this.componentConfig.mapgl_settings !== undefined) {
      if (this.componentConfig.mapgl_settings.has_topology_mode !== undefined) {
        hasTopologyMode = this.componentConfig.mapgl_settings.has_topology_mode;
      }
    }
    return hasTopologyMode;
  }

  public hasClusterMode(): boolean {
    let hasClusterMode = true;
    if (this.componentConfig.mapgl_settings !== undefined) {
      if (this.componentConfig.mapgl_settings.has_cluster_mode !== undefined) {
        hasClusterMode = this.componentConfig.mapgl_settings.has_cluster_mode;
      }
    }
    return hasClusterMode;
  }
}
