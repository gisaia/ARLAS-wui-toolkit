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
import { ComputationRequest, ComputationResponse } from 'arlas-api';
import { projType } from 'arlas-web-core';
import { MapService } from '../../tools/utils';
import { ArlasCollaborativesearchService } from '../collaborative-search/arlas.collaborative-search.service';
import { AbstractArlasMapGL } from 'arlas-map';

/**
 * This service provides methods to apply on the mapboxgl Map object
 */
@Injectable()
export class ArlasMapService implements MapService {

  public map: AbstractArlasMapGL;

  public constructor(private collaborativeSearchService: ArlasCollaborativesearchService) {
  }

  /**
   * @description zooms to the data extent. If 'map' parameter is not defined, then this function uses the 'map' attribute
   * @param geoPointField geo-point field used to get the bounding box of the data
   * @param map Map object of mapboxgl
   * @param paddingPercentage a percentage of the extent's height and width
   * that is added as a padding to bbox of data (between 0 and 1). It allows to have some context around data
   */
  public zoomToData(collection: string, geoPointField: string, map: AbstractArlasMapGL, paddingPercentage?: number) {
    const computationRequest: ComputationRequest = {
      metric: ComputationRequest.MetricEnum.GEOBBOX,
      field: geoPointField
    };
    let mapInstance = map;
    if (map === null || map === undefined) {
      mapInstance = this.map;
    }
    this.collaborativeSearchService.resolveButNotComputation([projType.compute, computationRequest],
      this.collaborativeSearchService.collaborations, collection)
      .subscribe((cr: ComputationResponse) => {
        if (cr && cr.geometry) {
          mapInstance.fitBounds(mapInstance.geometryToBound(cr.geometry, paddingPercentage));
        }
      });
  }

  /**
   *
   * @param map mapbox map instance
   */
  public setMap(map: AbstractArlasMapGL) {
    this.map = map;
  }
}
