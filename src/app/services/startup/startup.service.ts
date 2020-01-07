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

import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, Injector } from '@angular/core';
import { Configuration, ExploreApi, CollectionsApi, CollectionReferenceDescription, Aggregation } from 'arlas-api';
import { DonutComponent, HistogramComponent, MapglComponent, PowerbarsComponent } from 'arlas-web-components';
import {
  HistogramContributor,
  MapContributor,
  ResultListContributor,
  SwimLaneContributor,
  ChipsSearchContributor,
  DetailedHistogramContributor,
  TopoMapContributor,
  TreeContributor,
  PowerbarsContributor,
  DonutContributor
} from 'arlas-web-contributors';
import { AnalyticsContributor } from 'arlas-web-contributors/contributors/AnalyticsContributor';
import * as portableFetch from 'portable-fetch';
import * as arlasConfSchema from './arlasconfig.schema.json';
import * as draftSchema from 'ajv/lib/refs/json-schema-draft-06.json';
import { CollaborativesearchService, ConfigService, Contributor } from 'arlas-web-core';
import { projType } from 'arlas-web-core/models/projections';
import { ContributorBuilder } from './contributorBuilder';
import { flatMap } from 'rxjs/operators';
import ajv from 'ajv';
import * as ajvKeywords from 'ajv-keywords/keywords/uniqueItemProperties';
import * as rootContributorConfSchema from 'arlas-web-contributors/jsonSchemas/rootContributorConf.schema.json';
import { Subject } from 'rxjs';
import { getFieldProperties } from 'app/tools/utils.js';

@Injectable({
    providedIn: 'root'
})
export class ArlasConfigService extends ConfigService {
    constructor() {
        super();
    }
}

@Injectable()
export class ArlasExploreApi extends ExploreApi {
    constructor(@Inject('CONF') conf: Configuration, @Inject('base_path') basePath: string,
        @Inject('fetch') fetch) {
        super(conf, basePath, fetch);
    }
}

@Injectable()
export class ArlasCollectionApi extends CollectionsApi {
    constructor(@Inject('CONF') conf: Configuration, @Inject('base_path') basePath: string,
        @Inject('fetch') fetch) {
        super(conf, basePath, fetch);
    }
}

@Injectable()
export class ArlasCollaborativesearchService extends CollaborativesearchService {
    constructor() {
        super();
    }
}

@Injectable()
export class ArlasStartupService {

    public contributorRegistry: Map<string, any> = new Map<string, any>();
    public shouldRunApp = true;
    public analytics: Array<{ groupId: string, components: Array<any> }>;
    public collectionId: string;
    public selectorById: string;
    public temporalContributor: Array<string> = new Array<string>();
    private errorMessagesList = new Array<string>();
    public errorStartUpServiceBus: Subject<any> = new Subject<any>();
    public arlasIsUp: Subject<boolean> = new Subject<boolean>();
    public arlasExploreApi: ArlasExploreApi;

    constructor(
        private configService: ArlasConfigService,
        private collaborativesearchService: ArlasCollaborativesearchService,
        private injector: Injector,
        private http: HttpClient, ) {
    }


    public errorStartUp() {
        this.errorStartUpServiceBus.subscribe(e => console.error(e));
    }

    public validateConfiguration(data) {
        return new Promise<any>((resolve, reject) => {
            const ajvObj = ajv();
            ajvKeywords(ajvObj);
            const validateConfig = ajvObj
                .addMetaSchema(draftSchema.default)
                .addSchema((<any>rootContributorConfSchema).default)
                .addSchema(HistogramContributor.getJsonSchema())
                .addSchema(DetailedHistogramContributor.getJsonSchema())
                .addSchema(SwimLaneContributor.getJsonSchema())
                .addSchema(ResultListContributor.getJsonSchema())
                .addSchema(MapContributor.getJsonSchema())
                .addSchema(TopoMapContributor.getJsonSchema())
                .addSchema(TreeContributor.getJsonSchema())
                .addSchema(ChipsSearchContributor.getJsonSchema())
                .addSchema(AnalyticsContributor.getJsonSchema())
                .addSchema(PowerbarsContributor.getJsonSchema())
                .addSchema(DonutContributor.getJsonSchema())
                .addSchema((<any>HistogramComponent.getHistogramJsonSchema()).default)
                .addSchema((<any>HistogramComponent.getSwimlaneJsonSchema()).default)
                .addSchema((<any>PowerbarsComponent.getPowerbarsJsonSchema()).default)
                .addSchema((<any>MapglComponent.getMapglJsonSchema()).default)
                .addSchema((<any>DonutComponent.getDonutJsonSchema()).default)
                .compile((<any>arlasConfSchema).default);
            if (validateConfig(data) === false) {
                const errorMessagesList = new Array<string>();
                errorMessagesList.push(
                    validateConfig.errors[0].dataPath + ' ' +
                    validateConfig.errors[0].message
                );
                reject(new Error(errorMessagesList.join(' ')));
            } else {
                resolve(data);
            }
        });
    }

    public setConfigService(data): Promise<any> {
        /**First set the raw config data in order to create an ArlasExploreApi instance */
        this.configService.setConfig(data);
        const collectionName = this.configService.getValue('arlas.server.collection.name');
        const arlasUrl = this.configService.getValue('arlas.server.url');
        const maxCacheAge = this.configService.getValue('arlas.server.max_age_cache');
        const configuration: Configuration = new Configuration();
        this.arlasExploreApi = new ArlasExploreApi(
            configuration,
            arlasUrl,
            portableFetch
        );
        return this.listAvailableFields(collectionName, this.arlasExploreApi, maxCacheAge)
            .then((availableFields: Set<string>) => this.applyFGA(data, availableFields))
            .then((data) => { this.configService.setConfig(data); return data; });
    }

    public applyFGA(data, availableFields: Set<string>): any {
        return this.removeWidgets(data, this.getContributorsToRemove(data, availableFields));
    }

    public getContributorsToRemove(data, availableFields: Set<string>): Set<string> {
        const availableFieldsd = new Set<string>();
        availableFieldsd.add('course.sog');
        const contributorsToRemove = new Set<string>();
        if (data) {
            /** the conf is validated before; therefore, `arlas.web.contributors` is defined */
            data.arlas.web.contributors.forEach(contributor => {
                /** check if aggregation model has a non-available field */
                if (contributor.aggregationmodels) {
                    contributor.aggregationmodels.forEach((am: Aggregation) => {
                        if (!availableFieldsd.has(am.field)) {
                          console.log(contributor.identifier)
                            contributorsToRemove.add(contributor.identifier);
                        }
                    });
                }
                if (contributor.swimlanes) {
                  contributor.swimlanes.forEach(swimlane => {
                    swimlane.aggregationmodels.forEach((am: Aggregation) => {
                      if (!availableFieldsd.has(am.field)) {
                        console.log(contributor.identifier)
                          contributorsToRemove.add(contributor.identifier);
                      }
                    });
                  });
                }
            });
        }
        return contributorsToRemove;
    }

    public removeWidgets(data, contributorsToRemove: Set<string>): any {
        if (data) {
            data.arlas.web.contributors = data.arlas.web.contributors.filter(contributor =>
                !contributorsToRemove.has(contributor.identifier));
            data.arlas.web.analytics.forEach(widget => {
              widget.components = widget.components.filter(c => !contributorsToRemove.has(c.contributorId));
            });
            data.arlas.web.analytics = data.arlas.web.analytics.filter(widget => widget.components.length > 0);
        }
        return data;
    }

    public listAvailableFields(collectionName: string, arlasExploreApi: ArlasExploreApi, maxCacheAge: number): Promise<Set<string>> {
      let availableFields = new Set<string>();
      /** Needs a fix of arlas-api to return Array<CollectionReferenceDescription> instead of CollectionReferenceDescription */
      return arlasExploreApi.list(false, maxCacheAge, {credentials: 'include'}).then((collectionDescriptions: any) => {
        collectionDescriptions.filter((cd: CollectionReferenceDescription) => cd.collection_name === collectionName)
          .forEach((cd: CollectionReferenceDescription) => {
            availableFields = new Set(getFieldProperties(cd.properties).map(p => p.label));
          }
        );
        return availableFields;
      });
    }

    public setCollaborativeService(data) {
        return new Promise<any>((resolve, reject) => {
            this.collaborativesearchService.setConfigService(this.configService);
            this.collaborativesearchService.setExploreApi(this.arlasExploreApi);
            this.collaborativesearchService.collection = this.configService.getValue('arlas.server.collection.name');
            this.collaborativesearchService.max_age = this.configService.getValue('arlas.server.max_age_cache');
            resolve(data);
        });
    }

    public testArlasUp(configData) {
        return new Promise<any>((resolve, reject) => {
            this.collaborativesearchService.resolveHits([projType.count, {}], this.collaborativesearchService.collaborations)
                .subscribe(
                    result => {
                        resolve(result);
                    },
                    error => {
                        reject(error);
                    });
        });
    }

    public buildContributor(data) {
        return new Promise<any>((resolve, reject) => {
            this.configService.getValue('arlas.web.contributors').forEach(contrib => {
                const contributorType = contrib.type;
                const contributorIdentifier = contrib.identifier;
                if (contributorType === 'resultlist') {
                    this.selectorById = contributorIdentifier;
                } else if (contributorType === 'histogram') {
                    const aggregationmodels = contrib.aggregationmodels;
                    aggregationmodels.forEach(
                        agg => {
                            if (agg.type === 'datehistogram') {
                                if (this.temporalContributor.indexOf(contributorIdentifier)) {
                                    this.temporalContributor.push(contributorIdentifier);
                                }
                            }
                        }
                    );
                } else if (contributorType === 'swimlane') {
                    const swimlanes = contrib.swimlanes;
                    swimlanes.forEach(swimlane => {
                        swimlane.aggregationmodels.forEach(
                            agg => {
                                if (agg.type === 'datehistogram') {
                                    if (this.temporalContributor.indexOf(contributorIdentifier)) {
                                        this.temporalContributor.push(contributorIdentifier);
                                    }
                                }
                            }
                        );
                    });
                } else if (contributorType === 'map' || contributorType === 'topomap') {
                    const zoomToPrecisionCluster: Array<Array<number>> = contrib.zoomToPrecisionCluster;
                    if (zoomToPrecisionCluster.filter(tab => (tab[1] - tab[2]) > 2).length > 0) {
                        const errorMessage = 'Invalid values in map zoomToPrecisionCluster elements.' +
                            'The difference between precision of geohash aggregation and' +
                            ' level of geohash to retrieve data like tile' +
                            ' must be less or equal to 2.';
                        this.shouldRunApp = false;
                        this.configService.setConfig({ error: [errorMessage] });
                        this.errorStartUpServiceBus.next({ error: [errorMessage] });
                    }
                }
                const contributor = ContributorBuilder.buildContributor(contributorType,
                    contributorIdentifier,
                    this.configService,
                    this.collaborativesearchService);
                this.contributorRegistry.set(contributorIdentifier, contributor);
            });
            this.collectionId = this.configService.getValue('arlas.server.collection.id');
            this.analytics = this.configService.getValue('arlas.web.analytics');
            this.arlasIsUp.next(true);
            resolve(data);
        });
    }


    /**
     * Loads extra configuration declared in the main configuration file.
     * @param extraConfig This object specifies
     * the path to the extra configuration file,
     * the attribute to change in the main configuration file,
     * and the attribute to take from the extra configuration file.
     * @param data Content of the extra configuration file
     */
    public loadExtraConfig(extraConfig: ExtraConfig, data: Object): Promise<any> {
        return this.http.get(extraConfig.configPath + '?' + Date.now())
            .toPromise()
            .then((extraConfigData) => {
                if (extraConfigData[extraConfig.replacer] !== undefined) {
                    this.setAttribute(extraConfig.replacedAttribute, extraConfigData[extraConfig.replacer], data);
                } else {
                    this.shouldRunApp = false;
                    this.errorMessagesList.push('The replacer : ' + extraConfig.replacer + ' does not exist in your '
                        + extraConfig.configPath + ' file.');
                }
            })
            .catch((err: any) => {
                console.error(err);
                return Promise.resolve(null);
            });
    }


    public load(configRessource: string): Promise<any> {
        let configData;
        const ret = this.http
            .get(configRessource)
            .pipe(flatMap((response) => {
                configData = response;
                if (configData.extraConfigs !== undefined) {
                    const promises = new Array<Promise<any>>();
                    configData.extraConfigs.forEach(extraConfig => promises.push(this.loadExtraConfig(extraConfig, configData)));
                    return Promise.all(promises);
                } else {
                    return Promise.resolve(null);
                }
            })).toPromise()
            .then(() => this.validateConfiguration(configData))
            .then((data) => this.setConfigService(data))
            .then((data) => this.setCollaborativeService(data))
            .then((data) => this.testArlasUp(data))
            .then((data) => this.buildContributor(data))
            .catch((err: any) => {
                console.error(err);
                return Promise.resolve(null);
            });
        return ret.then((x) => {});
    }
    private setAttribute(path, value, object) {
        const pathToList = path.split('.');
        const pathLength = pathToList.length;
        for (let i = 0; i < pathLength - 1; i++) {
            const element = pathToList[i];
            if (!object[element]) {
                this.shouldRunApp = false;
                this.errorMessagesList.push('The attribute : ' + path + ' does not exist in your main configuration.');
            }
            object = object[element];
        }
        object[pathToList[pathLength - 1]] = value;
    }

}

export interface ExtraConfig {
    configPath: string;
    replacedAttribute: string;
    replacer: string;
}

