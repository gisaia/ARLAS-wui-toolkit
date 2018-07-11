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

import { Injectable, Inject, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import * as portableFetch from 'portable-fetch';
import * as ajv from 'ajv';

import { HistogramComponent, PowerbarsComponent, MapglComponent, DonutComponent } from 'arlas-web-components';
import {
    HistogramContributor,
    MapContributor,
    PowerbarsContributor,
    ResultListContributor,
    SwimLaneContributor,
    ChipsSearchContributor,
    DonutContributor,
    DetailedHistogramContributor
} from 'arlas-web-contributors';
import * as rootContributorConfSchema from 'arlas-web-contributors/jsonSchemas/rootContributorConf.schema.json';
import { ConfigService, CollaborativesearchService } from 'arlas-web-core';
import { projType } from 'arlas-web-core/models/projections';
import { Configuration, ExploreApi, WriteApi } from 'arlas-api';

import * as arlasConfSchema from './arlasconfig.schema.json';
import { ContributorBuilder } from './contributorBuilder';

@Injectable()
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
export class ArlasWriteApi extends WriteApi {
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

    constructor(private http: Http,
        private configService: ArlasConfigService,
        private collaborativesearchService: ArlasCollaborativesearchService) {
    }
    public loadExtraConfig(extraConfig: ExtraConfig, data: Object): Promise<any> {
          return this.http.get(extraConfig.configPath)
              .map((res: Response) => res.json())
              .toPromise()
              .then((extraConfigData) => {
                  if (extraConfigData[extraConfig.replacer] !== undefined) {
                      this.setAttribute(extraConfig.replacedAttribute, extraConfigData[extraConfig.replacer], data);
                  } else {
                      this.shouldRunApp = false;
                      this.errorMessagesList.push('The replacer : ' + extraConfig.replacer + ' does not exist in your '
                        + extraConfig.configPath + ' file.' );
                  }
              })
              .catch((err: any) => {
                  console.log(err);
                  return Promise.resolve(null);
              });
    }

    public load(configRessource: string): Promise<any> {
        let configData;
        const ret = this.http
            .get(configRessource)
            .map((res: Response) => res.json())
            .flatMap((response) => {
              configData = response;
              if (configData.extraConfigs !== undefined) {
                const promises = new Array<Promise<any>>();
                configData.extraConfigs.forEach(extraConfig => promises.push(this.loadExtraConfig(extraConfig, configData)));
                return Promise.all(promises);
              } else {
                return Promise.resolve(null);
              }
            })
            .toPromise()
            .then(() => {
                const validateConfig = ajv()
                    .addSchema(rootContributorConfSchema)
                    .addSchema(HistogramContributor.getJsonSchema())
                    .addSchema(DetailedHistogramContributor.getJsonSchema())
                    .addSchema(SwimLaneContributor.getJsonSchema())
                    .addSchema(PowerbarsContributor.getJsonSchema())
                    .addSchema(ResultListContributor.getJsonSchema())
                    .addSchema(MapContributor.getJsonSchema())
                    .addSchema(DonutContributor.getJsonSchema())
                    .addSchema(ChipsSearchContributor.getJsonSchema())
                    .addSchema(HistogramComponent.getHistogramJsonSchema())
                    .addSchema(HistogramComponent.getSwimlaneJsonSchema())
                    .addSchema(PowerbarsComponent.getPowerbarsJsonSchema())
                    .addSchema(MapglComponent.getMapglJsonSchema())
                    .addSchema(DonutComponent.getDonutJsonSchema())
                    .compile(arlasConfSchema);
                if (validateConfig(configData) === false) {
                    this.shouldRunApp = false;
                    this.errorMessagesList.push(
                        validateConfig.errors[0].dataPath + ' ' +
                        validateConfig.errors[0].message
                    );
                    this.configService.setConfig({ error: this.errorMessagesList });
                } else if (!this.shouldRunApp) {
                  this.configService.setConfig({ error: this.errorMessagesList });
                } else {
                    this.configService.setConfig(configData);
                    this.collaborativesearchService.setConfigService(this.configService);
                    const configuraiton: Configuration = new Configuration();
                    const arlasExploreApi: ArlasExploreApi = new ArlasExploreApi(
                        configuraiton,
                        this.configService.getValue('arlas.server.url'),
                        portableFetch
                    );
                    this.collaborativesearchService.setExploreApi(arlasExploreApi);
                    const arlasWriteApi = new ArlasWriteApi(
                      configuraiton,
                      this.configService.getValue('arlas.server.url'),
                      portableFetch
                    );
                    this.collaborativesearchService.setWriteApi( arlasWriteApi);
                    this.collaborativesearchService.collection = this.configService.getValue('arlas.server.collection.name');
                    this.collaborativesearchService.max_age = this.configService.getValue('arlas.server.max_age');
                    this.collaborativesearchService.resolveHits([projType.count, {}], this.collaborativesearchService.collaborations)
                        .subscribe(
                        result => { this.shouldRunApp = true; },
                        error => {
                            this.shouldRunApp = false;
                            alert('Unreachable ARLAS Server : ' + this.configService.getValue('arlas.server.url'));
                        });
                }
                if (this.shouldRunApp) {
                    Object.keys(this.configService.getValue('arlas.web.contributors')).forEach(key => {
                        const contributorType = key.split('$')[0];
                        const contributorIdentifier = key.split('$')[1];
                        if (contributorType === 'resultlist') {
                            this.selectorById = contributorIdentifier;
                        } else if (contributorType === 'histogram') {
                            const aggregationmodels = this.configService
                                .getValue('arlas.web.contributors')[key]['aggregationmodels'];
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
                            const swimlanes = this.configService.getValue('arlas.web.contributors')[key]['swimlanes'];
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
                        }
                        const contributor = ContributorBuilder.buildContributor(contributorType,
                            contributorIdentifier,
                            this.configService,
                            this.collaborativesearchService);
                        this.contributorRegistry.set(contributorIdentifier, contributor);
                    });
                    this.collectionId = this.configService.getValue('arlas.server.collection.id');
                    this.analytics = this.configService.getValue('arlas.web.analytics');
                }

            })
            .catch((err: any) => {
                console.log(err);
                return Promise.resolve(null);
            });
        return ret.then((x) => {
        });
    }

    private setAttribute(path, value, object) {
      const pathToList = path.split('.');
      const pathLength = pathToList.length;
      for (let i = 0; i < pathLength - 1; i++) {
          const element = pathToList[i];
          if ( !object[element] ) {
            this.shouldRunApp = false;
            this.errorMessagesList.push('The attribute : ' + path + ' does not exist in your main configuration.' );
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


