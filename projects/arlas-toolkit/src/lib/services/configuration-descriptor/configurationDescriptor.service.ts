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
import { CollectionReferenceDescription, Configuration } from 'arlas-api';
import { from, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { getFieldProperties } from '../../tools/utils';
import { ArlasCollaborativesearchService } from '../collaborative-search/arlas.collaborative-search.service';
import { ArlasConfigService, ArlasExploreApi } from '../startup/startup.service';


@Injectable()
export class ArlasConfigurationDescriptor {

  public fetchOptions = {
    credentials: 'include'
  };

  public constructor(
    private collaborativesearchService: ArlasCollaborativesearchService,
    private configService: ArlasConfigService,
  ) { }

  /**
   * @description Returns an Observable that contains the list of all collections
   * declared in ARLAS-server (that is configurated in env.js ( serverUrl )
   */
  public getAllCollections(): Observable<Array<string>> {
    return <Observable<Array<string>>>from(this.collaborativesearchService.list(false)).pipe(
      map(
        (collections: Array<CollectionReferenceDescription>) => collections.map(
          (collection: CollectionReferenceDescription) => collection.collection_name
        )
          .filter(collection => collection !== 'metacollection')
      )
    );
  }

  /**
   *
   * @param types
   * @description Returns an Observable that contains a list of the fields which types are in `types` param.
   * If no `types` are specified, then all the fields are returned.
   */
  public getFields(types?: Array<string>): Observable<Array<{ label: string; type: string; }>> {
    const configuration: Configuration = new Configuration();
    const arlasExploreApi: ArlasExploreApi = new ArlasExploreApi(
      configuration,
      this.configService.getValue('arlas.server.url'),
      window.fetch
    );
    this.collaborativesearchService.setExploreApi(arlasExploreApi);
    return this.collaborativesearchService.describe(this.configService.getValue('arlas.server.collection.name')).pipe(
      filter(description => description.properties !== undefined),
      map(description => getFieldProperties(description.properties)),
      map(fields => types ? fields.filter(field => types.find(type => type === field.type) !== undefined)
        : fields)
    );
  }
}
