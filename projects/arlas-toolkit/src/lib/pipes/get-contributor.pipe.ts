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

import { inject, Pipe, PipeTransform } from '@angular/core';
import { Contributor } from 'arlas-web-core';
import { ArlasCollaborativesearchService } from '../services/collaborative-search/arlas.collaborative-search.service';

/**
 * Returns the contributor that has the given contributorId
 */
@Pipe({
  name: 'getContributor',
  standalone: true
})
export class GetContributorPipe implements PipeTransform {
  private readonly collaborativeService = inject(ArlasCollaborativesearchService);

  public transform(contributorId: string | undefined): Contributor | undefined {
    if (contributorId) {
      return this.collaborativeService.registry.get(contributorId);
    }
    return undefined;
  }
}
