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

@Injectable()
export class ArlasMapSettings implements MapSettingsService {

  public MAPCONTRIBUTOR_ID = 'mapbox';
  public componentConfig;
  public mapContributor: MapContributor;

  constructor(public startUpService: ArlasStartupService, private configService: ArlasConfigService) {
    this.mapContributor = <MapContributor>this.startUpService.contributorRegistry.get(this.MAPCONTRIBUTOR_ID);
    this.componentConfig = this.configService.getValue('arlas.web.components');
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
}
