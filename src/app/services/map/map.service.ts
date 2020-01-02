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
import { ArlasCollaborativesearchService } from '../startup/startup.service';
import { projType } from 'arlas-web-core';
import { ComputationRequest, ComputationResponse } from 'arlas-api';
import { LngLatBounds, Map, LngLat } from 'mapbox-gl';
import bbox from '@turf/bbox';
import { BBox } from '@turf/helpers';
import { MapService } from '../../tools/utils';


/**
 * This service provides methods to apply on the mapboxgl Map object
 */
@Injectable()
export class ArlasMapService implements MapService {

  constructor(private collaborativeSearchService: ArlasCollaborativesearchService) {
  }

  /**
   * @description zooms to the data extent
   * @param geoPointField geo-point field used to get the bounding box of the data
   * @param map Map object of mapboxgl
   * @param paddingPercentage a percentage added to the bbox of data (between 0 and 1) that allows to have some context around data
   */
  public zoomToData(geoPointField: string, map: Map, paddingPercentage?: number) {
    const computationRequest: ComputationRequest = {
      metric: ComputationRequest.MetricEnum.GEOBBOX,
      field: geoPointField
    };

    this.collaborativeSearchService.resolveButNotComputation([projType.compute, computationRequest],
      this.collaborativeSearchService.collaborations).subscribe( (cr: ComputationResponse) => {
        if (cr && cr.geometry) {
          map.fitBounds(this.toMapboxBounds(cr.geometry, paddingPercentage));
        }
      });
  }

  /**
   * @description transforms the geojson object to a mapbox bounds
   * @param geometry geojson object
   * @param paddingPercentage a percentage added to the bbox of data (between 0 and 1) that allows to have some context around data
   */
  private toMapboxBounds(geometry: any, paddingPercentage?: number): LngLatBounds {
    const boundingBox: BBox = bbox(geometry);
    const west = (paddingPercentage !== undefined) ? boundingBox[0] - Math.abs(boundingBox[0] * paddingPercentage) : boundingBox[0];
    const south = (paddingPercentage !== undefined) ? boundingBox[1] - Math.abs(boundingBox[1] * paddingPercentage) : boundingBox[1];
    const east = (paddingPercentage !== undefined) ? boundingBox[2] + Math.abs(boundingBox[2] * paddingPercentage) : boundingBox[2];
    const north = (paddingPercentage !== undefined) ? boundingBox[3] + Math.abs(boundingBox[3] * paddingPercentage) : boundingBox[3];
    const mapboxBounds  = new LngLatBounds(
      new LngLat(west, south),
      new LngLat(east, north)
    );
    return mapboxBounds;
  }
}
