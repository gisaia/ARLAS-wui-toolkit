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
import { Filter } from 'arlas-api';
import { MetricsTableContributor, TreeContributor } from 'arlas-web-contributors';
import { CollaborativesearchService } from 'arlas-web-core';

@Injectable({
  providedIn: 'root'
})
export class ArlasCollaborativesearchService extends CollaborativesearchService {
  public constructor() {
    super();
  }

  public endOfUrlCollaboration = false;

  /**
   * @param filter The filter query parameter
   * @param changeOperator Whether to change the operator of the filters applied for TreeContributors
   * @returns A dictionnary of the current collaborations
   */
  public dataModelBuilder(filter, changeOperator = false) {
    const dataModel = JSON.parse(filter);
    const defaultCollection = this.defaultCollection;
    const registry = this.registry;
    /** transform "filters" object to Map */
    Object.keys(dataModel).forEach(key => {
      const collab = dataModel['' + key];
      const contributor = registry.get(key);
      if (!!collab && !!collab.filters) {
        collab.filters = new Map(Object.entries(collab.filters));
      } else if (!!collab && !collab.filters && !!collab.filter) {
        /** retrocompatibility code to transform an pre-18 collaboration structure to 18 one */
        collab.filters = new Map();
        collab.filters.set(defaultCollection, [{...collab.filter}]);
        delete collab.filter;
      }
      if (contributor && contributor instanceof TreeContributor && changeOperator) {
        collab.filters.forEach((filters: any[], collection: string) => {
          const exp = filters[0].f[0][0];
          const op = exp.op;
          const treecontributor = contributor;
          if (op !== treecontributor.getFilterOperator()) {
            if (treecontributor.allowOperatorChange) {
              treecontributor.setFilterOperator(op, true);
            } else {
              delete dataModel['' + key];
              this.collaborations.delete(key);
            }
          }
        });
      }
      if (contributor && contributor instanceof MetricsTableContributor && changeOperator) {
        collab.filters.forEach((filters: any[], collection: string) => {
          const exp = filters[0].f[0][0];
          const op = exp.op;
          const metrictablecontributor = contributor;
          if (op !== metrictablecontributor.getFilterOperator()) {
            metrictablecontributor.setFilterOperator(op, true);

          }
        });
      }
    });
    return dataModel;
  }

  public getCollectionsFromFilters(dataModel): Set<string> {
    const collections = new Set<string>();
    Object.keys(dataModel).forEach(k => {
      const collab = dataModel[k];
      if (collab?.filters) {
        const filters = collab.filters as Map<string, any>;
        Array.from(filters.keys()).forEach(c => collections.add(c));
      }
    });
    return collections;
  }

  public getFilters(collection: string): Array<Filter> {
    const filters: Filter[] = [];
    Array.from(this.collaborations.values()).forEach(c => {
      if (c.filters.get(collection)) {
        filters.push(...c.filters.get(collection));
      }
    });

    return filters;
  }
}
