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
    PowerbarsContributor,
    ResultListContributor,
    SwimLaneContributor,
    ComputeContributor,
    DonutContributor,
    TreeContributor,
    ChipsSearchContributor,
    MapContributor,
    TopoMapContributor
} from 'arlas-web-contributors';
import { ArlasConfigService, ArlasCollaborativesearchService } from './startup.service';

export class ContributorBuilder {

    public static buildContributor(contributorType: string,
        identifier: string,
        configService: ArlasConfigService,
        collaborativesearchService: ArlasCollaborativesearchService): any {

        const config = configService.getValue('arlas.web.contributors').find( contrib =>
          contrib.type === contributorType && contrib.identifier ===  identifier
        );
        let contributor;
        let isOneDimension: boolean;

        switch (contributorType) {
            case 'metric':
                contributor = new ComputeContributor(identifier, collaborativesearchService, configService);
                break;
            case 'histogram':
                isOneDimension = config['isOneDimension'];
                contributor = new HistogramContributor(identifier, collaborativesearchService, configService, isOneDimension);
                break;
            case 'detailedhistogram':
                isOneDimension = config['isOneDimension'];
                contributor = new DetailedHistogramContributor(identifier, collaborativesearchService, configService, isOneDimension);
                break;
            case 'powerbars':
                const title: string = config['title'];
                contributor = new PowerbarsContributor(identifier,
                    collaborativesearchService,
                    configService,
                    title);
                break;
            case 'resultlist':
                contributor = new ResultListContributor(identifier, collaborativesearchService, configService);
                break;
            case 'map':
                contributor = new MapContributor(identifier, collaborativesearchService, configService)
                break;
            case 'topomap':
                contributor = new TopoMapContributor(identifier, collaborativesearchService, configService)
                break;
            case 'swimlane':
                isOneDimension = config['isOneDimension'];
                contributor = new SwimLaneContributor(identifier, collaborativesearchService, configService);
                break;
            case 'donut':
                const titleDonut: string = config['title'];
                contributor = new DonutContributor(identifier,
                    collaborativesearchService,
                    configService,
                    titleDonut
                );
                break;
            case 'tree':
                const titletree: string = config['title'];
                    contributor = new TreeContributor(identifier,
                    collaborativesearchService,
                    configService,
                    titletree
                );
                break;
            case 'chipssearch':
                  contributor = new ChipsSearchContributor(identifier,
                    collaborativesearchService,
                    configService
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
                    groupIdToValues
                );
                break;
        }
        return contributor;
    }
}
