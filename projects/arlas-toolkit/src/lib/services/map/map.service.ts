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
import bbox from '@turf/bbox';
import { ComputationRequest, ComputationResponse } from 'arlas-api';
import { projType } from 'arlas-web-core';
import { LngLat, LngLatBounds, Map } from 'mapbox-gl';
import { MapService } from '../../tools/utils';
import { ArlasCollaborativesearchService } from '../collaborative-search/arlas.collaborative-search.service';

/**
 * This service provides methods to apply on the mapboxgl Map object
 */
@Injectable()
export class ArlasMapService implements MapService {

  public map: Map;

  public constructor(private collaborativeSearchService: ArlasCollaborativesearchService) {
  }

  /**
   * @description zooms to the data extent. If 'map' parameter is not defined, then this function uses the 'map' attribute
   * @param geoPointField geo-point field used to get the bounding box of the data
   * @param map Map object of mapboxgl
   * @param paddingPercentage a percentage of the extent's height and width
   * that is added as a padding to bbox of data (between 0 and 1). It allows to have some context around data
   */
  public zoomToData(collection: string, geoPointField: string, map: Map, paddingPercentage?: number) {
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
          mapInstance.fitBounds(this.toMapboxBounds(cr.geometry, paddingPercentage));
        }
      });
  }

  /**
   *
   * @param map mapbox map instance
   */
  public setMap(map: Map) {
    this.map = map;
  }
  /**
   * @description transforms the geojson object to a mapbox bounds
   * @param geometry geojson object
   * @param paddingPercentage a percentage of the extent's height and width
   * that is added as a padding to bbox of data (between 0 and 1). It allows to have some context around data
   */
  private toMapboxBounds(geometry: any, paddingPercentage?: number): LngLatBounds {
    const boundingBox: any = bbox(geometry);
    let west = boundingBox[0];
    let south = boundingBox[1];
    let east = boundingBox[2];
    let north = boundingBox[3];
    if (paddingPercentage !== undefined) {
      let width = east - west;
      let height = north - south;
      /** if there is one hit, then west=east ===> we consider a width of 0.05°*/
      if (width === 0) {
        width = 0.05;
      }
      /** if there is one hit, then north=south ===> we consider a height of 0.05°*/
      if (height === 0) {
        height = 0.05;
      }
      west = west - paddingPercentage * width;
      south = Math.max(-90, south - paddingPercentage * height);
      east = east + paddingPercentage * width;
      north = Math.min(90, north + paddingPercentage * height);
    }
    const mapboxBounds = new LngLatBounds(
      new LngLat(west, south),
      new LngLat(east, north)
    );
    return mapboxBounds;
  }
}
