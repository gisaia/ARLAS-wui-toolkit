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

import {
  HistogramContributor,
  DetailedHistogramContributor,
  AnalyticsContributor,
  ResultListContributor,
  SwimLaneContributor,
  ComputeContributor,
  TreeContributor,
  ChipsSearchContributor,
  MapContributor
} from 'arlas-web-contributors';
import { ArlasConfigService, ArlasCollaborativesearchService } from './startup.service';
import { ArlasSettingsService } from '../settings/arlas.settings.service';
import { ArlasColorService } from 'arlas-web-components';

export class ContributorBuilder {

  public static buildContributor(contributorType: string,
    identifier: string,
    configService: ArlasConfigService,
    collaborativesearchService: ArlasCollaborativesearchService,
    settingsService: ArlasSettingsService,
    colorService?: ArlasColorService): any {

    const config = configService.getValue('arlas.web.contributors').find(contrib =>
      contrib.type === contributorType && contrib.identifier === identifier
    );
    const collection = !!config['collection'] ? config['collection'] : collaborativesearchService.defaultCollection;
    let contributor;
    let isOneDimension: boolean;
    let additionalCollections: Array<any>;
    switch (contributorType) {
      case 'metric':
        contributor = new ComputeContributor(identifier, collaborativesearchService, configService, collection);
        break;
      case 'histogram':
        isOneDimension = config['isOneDimension'];
        additionalCollections = config['additionalCollections'];
        contributor = new HistogramContributor(identifier, collaborativesearchService, configService, collection,
          isOneDimension, additionalCollections);
        (contributor as HistogramContributor).maxBuckets = settingsService.getHistogramMaxBucket();
        break;
      case 'detailedhistogram':
        isOneDimension = config['isOneDimension'];
        additionalCollections = config['additionalCollections'];
        contributor = new DetailedHistogramContributor(identifier, collaborativesearchService, configService, collection,
          isOneDimension, additionalCollections);
        (contributor as DetailedHistogramContributor).maxBuckets = settingsService.getHistogramMaxBucket();
        break;
      case 'resultlist':
        contributor = new ResultListContributor(identifier, collaborativesearchService, configService, collection);
        break;
      case 'map':
        contributor = new MapContributor(identifier, collaborativesearchService, configService, collection, colorService?.colorGenerator);
        break;
      case 'swimlane':
        isOneDimension = config['isOneDimension'];
        contributor = new SwimLaneContributor(identifier, collaborativesearchService, configService, collection);
        break;
      case 'tree':
        const titletree: string = config['title'];
        contributor = new TreeContributor(identifier,
          collaborativesearchService,
          configService,
          titletree, collection
        );
        break;
      case 'chipssearch':
        contributor = new ChipsSearchContributor(identifier,
          collaborativesearchService,
          configService, collection
        );
        break;
      case 'analytics':
        const groupIdToValues = new Map<string, Array<string>>();
        const analytics = configService.getValue('arlas.web.analytics');
        if (analytics) {
          analytics.forEach(analytic => {
            if (analytic.filterValues) {
              groupIdToValues.set(analytic.groupId, analytic.filterValues);
            } else {
              groupIdToValues.set(analytic.groupId, ['*']);
            }
          });
        }
        contributor = new AnalyticsContributor(identifier,
          collaborativesearchService,
          configService,
          collection,
          groupIdToValues
        );
        break;
    }
    contributor.updateData = false;
    return contributor;
  }

  /** Returns all the collections that are configured in each type of contributor. */
  public static getCollections(contributorsConfig: any[]): Set<string> {
    const collections = new Set<string>();
    contributorsConfig.forEach(contributor => {
      if (contributor.collection) {
        collections.add(contributor.collection);
      }
      /** For histograms, multi-collection is possible. We need to check the 'additionalCollections' attribute.*/
      if (contributor.type === 'histogram') {
        if (contributor.additionalCollections && Array.isArray(contributor.additionalCollections)) {
          contributor.additionalCollections.forEach(ac => {
            collections.add(ac.collectionName);
          });
        }
      }
    });

    return collections;
  }
}

