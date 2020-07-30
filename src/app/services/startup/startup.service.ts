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
import { Inject, Injectable, Injector, InjectionToken } from '@angular/core';
import { Configuration, ExploreApi, CollectionsApi, CollectionReferenceDescription, CollectionReferenceParameters } from 'arlas-api';
import { DonutComponent, HistogramComponent, MapglComponent, PowerbarsComponent, MetricComponent } from 'arlas-web-components';
import {
    HistogramContributor,
    MapContributor,
    ResultListContributor,
    SwimLaneContributor,
    ChipsSearchContributor,
    DetailedHistogramContributor,
    TreeContributor,
    ComputeContributor
} from 'arlas-web-contributors';
import { AnalyticsContributor } from 'arlas-web-contributors/contributors/AnalyticsContributor';
import * as portableFetch from 'portable-fetch';
import * as arlasConfSchema from './arlasconfig.schema.json';
import * as arlasSettingsSchema from './settings.schema.json';
import * as draftSchema from 'ajv/lib/refs/json-schema-draft-06.json';
import { CollaborativesearchService, ConfigService, Contributor } from 'arlas-web-core';
import { projType } from 'arlas-web-core/models/projections';
import { ContributorBuilder } from './contributorBuilder';
import { flatMap } from 'rxjs/operators';
import ajv from 'ajv';
import YAML from 'js-yaml';
import * as ajvKeywords from 'ajv-keywords/keywords/uniqueItemProperties';
import * as rootContributorConfSchema from 'arlas-web-contributors/jsonSchemas/rootContributorConf.schema.json';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { LOCATION_INITIALIZED } from '@angular/common';
import { ArlasConfigurationUpdaterService } from '../configuration-updater/configurationUpdater.service.js';
import { getFieldProperties } from '../../tools/utils.js';
import { EnvService } from '../env/env.service';
import { PersistenceService } from '../../services/persistence/persistence.service';
import { DataWithLinks } from 'arlas-persistence-api';
import { AuthentificationService, AuthentSetting } from '../authentification/authentification.service';


@Injectable({
    providedIn: 'root'
})
export class ArlasConfigService extends ConfigService {
    public errorsQueue = new Array<Error>();
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

export const CONFIG_UPDATER = new InjectionToken<Function>('config_updater');
export const FETCH_OPTIONS = new InjectionToken<any>('fetch_options');

export interface Error {
  origin: string;
  message: string;
  reason: string;
}

@Injectable()
export class ArlasStartupService {
    public contributorRegistry: Map<string, any> = new Map<string, any>();
    public shouldRunApp = true;
    public analytics: Array<{ groupId: string, components: Array<any> }>;
    public collectionsMap: Map<string, CollectionReferenceParameters> = new Map();
    public collectionId: string;
    public selectorById: string;
    public temporalContributor: Array<string> = new Array<string>();
    private errorMessagesList = new Array<string>();
    public errorStartUpServiceBus: Subject<any> = new Subject<any>();
    public arlasIsUp: Subject<boolean> = new Subject<boolean>();
    public arlasExploreApi: ArlasExploreApi;
    public errorsQueue = new Array<Error>();
    private CONFIG_ID_QUERY_PARAM = 'config_id';
    private SETTINGS_FILE_NAME = 'settings.yaml';
    private useAuthent = false;

    constructor(
        private configService: ArlasConfigService,
        private collaborativesearchService: ArlasCollaborativesearchService,
        private configurationUpdaterService: ArlasConfigurationUpdaterService,
        private injector: Injector,
        @Inject(FETCH_OPTIONS) private fetchOptions,
        private http: HttpClient, private translateService: TranslateService,
        @Inject(CONFIG_UPDATER) private configUpdater,
        private envService: EnvService,
        private persistenceService: PersistenceService        ) {


    }

    public getFGAService(): ArlasConfigurationUpdaterService {
      return this.configurationUpdaterService;
    }

    public errorStartUp() {
        this.errorStartUpServiceBus.subscribe(e => console.error(e));
    }


    public validateSettings(settings) {
      return new Promise<any>((resolve, reject) => {
          const ajvObj = ajv();
          ajvKeywords(ajvObj);
          const validateConfig = ajvObj
              .addMetaSchema(draftSchema.default)
              .compile((<any>arlasSettingsSchema).default);
          if (settings && validateConfig(settings) === false) {
              const errorMessagesList = new Array<string>();
              errorMessagesList.push(
                  validateConfig.errors[0].dataPath + ' ' +
                  validateConfig.errors[0].message
              );
              reject(new Error(errorMessagesList.join(' ')));
          } else {
              resolve(settings);
          }
      });
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
                .addSchema(TreeContributor.getJsonSchema())
                .addSchema(ChipsSearchContributor.getJsonSchema())
                .addSchema(AnalyticsContributor.getJsonSchema())
                .addSchema(ComputeContributor.getJsonSchema())
                .addSchema((<any>HistogramComponent.getHistogramJsonSchema()).default)
                .addSchema((<any>HistogramComponent.getSwimlaneJsonSchema()).default)
                .addSchema((<any>PowerbarsComponent.getPowerbarsJsonSchema()).default)
                .addSchema((<any>MapglComponent.getMapglJsonSchema()).default)
                .addSchema((<any>DonutComponent.getDonutJsonSchema()).default)
                .addSchema((<any>MetricComponent.getMetricJsonSchema()).default)
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
    public translationLoaded(data) {
        return new Promise<any>((resolve: any) => {
            const url = window.location.href;
            const paramLangage = 'lg';
            // Set default language to current browser language
            let langToSet = navigator.language.slice(0, 2);
            const regex = new RegExp('[?&]' + paramLangage + '(=([^&#]*)|&|#|$)');
            const results = regex.exec(url);
            if (results && results[2]) {
                langToSet = decodeURIComponent(results[2].replace(/\+/g, ' '));
            }
            const locationInitialized = this.injector.get(LOCATION_INITIALIZED, Promise.resolve(null));
            locationInitialized.then(() => {
                this.translateService.setDefaultLang('en');
                this.translateService.use(langToSet).subscribe(() => {
                    console.log(`Successfully initialized '${langToSet}' language.`);
                }, err => {
                    console.error(`Problem with '${langToSet}' language initialization.'`);
                }, () => {
                    resolve([data, langToSet]);
                });
            });
        });
    }

    public setConfigService(data) {
       /**First set the raw config data in order to create an ArlasExploreApi instance */
       const newConfig = this.configUpdater(data);
       this.configService.setConfig(newConfig);
       this.collaborativesearchService.setFetchOptions(this.fetchOptions);
       const arlasUrl = this.configService.getValue('arlas.server.url');
           const configuration: Configuration = new Configuration();
           this.arlasExploreApi = new ArlasExploreApi(
             configuration,
             arlasUrl,
             portableFetch
           );
       this.collaborativesearchService.setConfigService(this.configService);
       this.collaborativesearchService.setExploreApi(this.arlasExploreApi);
       return data;
    }

    /**
     * Updates configuration by keeping only components/widgets that are availbale for exploration
     * @param data configuration object
     * @param availableFields list of fields that are available for exploration
     * @returns the updated configuration object
     */
    public updateConfiguration(data, availableFields: Set<string>): any {
      const contributorsToRemove: Set<string> = this.configurationUpdaterService.getContributorsToRemove(data, availableFields);
      let updatedConfig = this.configurationUpdaterService.removeContributors(data, contributorsToRemove);
      updatedConfig = this.configurationUpdaterService.updateContributors(updatedConfig, availableFields);
      updatedConfig = this.configurationUpdaterService.updateMapComponent(updatedConfig, availableFields);
      updatedConfig = this.configurationUpdaterService.removeWidgets(updatedConfig, contributorsToRemove);
      updatedConfig = this.configurationUpdaterService.removeTimelines(updatedConfig, contributorsToRemove);
      return updatedConfig;
    }

    /**
     * Retrieves fields that are available for exploration and updates the configuration to keep only corresponding widgets and components
     * @param data configuration object
     * @param useAuthent whether authentication is activated or not.
     */
    public applyFGA(data, useAuthent) {
      const collectionName = this.configService.getValue('arlas.server.collection.name');
      return new Promise<any>((resolve, reject) => {
          if (useAuthent) {
            const authService = this.injector.get('AuthentificationService')[0];
            authService.canActivateProtectedRoutes.subscribe(isActivable => {
                if (isActivable) {
                    this.collaborativesearchService.setFetchOptions({
                        headers: {
                            'Authorization': 'Bearer ' + authService.idToken
                        }
                    });
                    resolve(this.applyFGAPromise(data, collectionName, useAuthent));
                } else {
                    resolve([null, useAuthent]);
                }
            });
          } else {
              resolve(this.applyFGAPromise(data, collectionName, useAuthent));
          }
      });
    }

    /**
     * - Fetches and parses the `settings.yaml`.
     * - Validates it against the correponding schema
     * - if authentication is configured, trigger authentication service that redirects to login page if it's the first time and fetches
     * the appropriate token
     * @returns ARLAS settings object Promise
     */
    public applyAppSettings(): Promise<ArlasSettings> {
      return this.http.get(this.SETTINGS_FILE_NAME, {responseType: 'text'}).toPromise()
        .catch((err) => {
          // application should not run if the settings.yaml file is absent
          this.shouldRunApp = false;
          console.error(err);
          const error: Error = {
            origin: this.SETTINGS_FILE_NAME + ' file',
            message: 'Cannot read "' + this.SETTINGS_FILE_NAME + '" file',
            reason: 'Please check if "' + this.SETTINGS_FILE_NAME + '" is in "src" folder'
          };
          this.errorsQueue.push(error);
          return {};
        })
        .then(s => {
          // parses the yaml file and validates it against the correponding schema
          const settings: ArlasSettings = YAML.safeLoad(s);
          return this.validateSettings(settings);
        })
        .catch((err: any) => {
          // application should not run if the settings.yaml file is not valid
          this.shouldRunApp = false;
          console.error(err);
          const error = {
              origin: 'ARLAS-wui `' + this.SETTINGS_FILE_NAME + '` file',
              message: err.toString().replace('Error:', ''),
              reason: 'Please check that the `src/' + this.SETTINGS_FILE_NAME + '` file is valid.'
          };
          this.errorsQueue.push(error);
          return Promise.resolve(null);
        })
        .then((settings: ArlasSettings) => {
          // if authentication is configured, trigger authentication service that redirects to login page if it's the first time and fetches
          // the appropriate token
          if (settings) {
            const authent: AuthentSetting = settings.authentication;
            if (authent && authent.use_authent === true) {
              this.useAuthent = settings.authentication.use_authent;
              const useDiscovery = authent.use_discovery;
              const authService: AuthentificationService = this.injector.get('AuthentificationService')[0];
              authService.initAuthService(authent, useDiscovery, this.useAuthent).then(() => settings);
            }
          }
          return settings;
      });
    }

    /**
     * - Fetches the configuration file from ARLAS-persistence if it's configurated, otherwise fetches the config.json in "src" folder.
     * - Validates the configuration against the corresponding schema
     * @param settings Arlas Settings object
     * @returns ARLAS Configuration object Promise
     */
    public getAppConfigurationObject(settings: ArlasSettings): Promise<any> {
        let configData;
        const url = new URL(window.location.href);
        const usePersistance = (this.envService.persistenceUrl && this.envService.persistenceUrl !== '');
        const configurationId = url.searchParams.get(this.CONFIG_ID_QUERY_PARAM);
        let configDataPromise: Promise<any>;
        if (usePersistance && configurationId) {
          // we use persistance and a configuration Id is provided
          configDataPromise = this.persistenceService.get(configurationId).toPromise()
              .then((s: DataWithLinks) => {
                const config =  JSON.parse(s.doc_value);
                configData = config;
                return Promise.resolve(config);
              }).catch((err) => {
                this.shouldRunApp = false;
                console.error(err);
                const error: Error = {
                  origin: 'ARLAS-persistence : ' + err.url,
                  message: 'Cannot fetch the configuration whose id is "' + configurationId + '"',
                  reason: 'Please check if ARLAS-persistence is up & running, ' +
                    'if the requested configuration exists and if you have rights to access it.'
                };
                this.errorsQueue.push(error);
                return Promise.resolve(configData);
              });
        } else {
          // persistence is not used, we use the config.json file mounted
          configDataPromise = this.http
              .get('config.json')
              .pipe(flatMap((response) => {
                  configData = response;
                  if (configData.extraConfigs !== undefined) {
                      const promises = new Array<Promise<any>>();
                      configData.extraConfigs.forEach(extraConfig => promises.push(this.loadExtraConfig(extraConfig, configData)));
                      return Promise.all(promises).then(() => configData);
                  } else {
                      return Promise.resolve(configData);
                  }
              })).toPromise();
        }
        return configDataPromise.then(configObject => this.validateConfiguration(configObject));
    }
    public setCollaborativeService(data, useAuthent) {
        return new Promise<any>((resolve, reject) => {
            this.collaborativesearchService.setConfigService(this.configService);
            this.collaborativesearchService.setExploreApi(this.arlasExploreApi);
            this.collaborativesearchService.collection = this.configService.getValue('arlas.server.collection.name');
            this.collaborativesearchService.max_age = this.configService.getValue('arlas.server.max_age_cache');
            if (useAuthent) {
              const authService = this.injector.get('AuthentificationService')[0];
              authService.canActivateProtectedRoutes.subscribe(isActivable => {
                  if (isActivable) {
                      this.collaborativesearchService.setFetchOptions({
                          headers: {
                              'Authorization': 'Bearer ' + authService.idToken
                          }
                      });
                      resolve(data);
                  }
              });
            } else {
                resolve(data);
            }
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

    public getCollections(data) {
        return new Promise<any>((resolve, reject) => {
            const collectionName = data.collection;
            this.collaborativesearchService.describe(collectionName)
                .subscribe(
                    result => {
                        this.collectionsMap.set(collectionName, result.params);
                        this.collectionId = result.params.id_path;
                        resolve(result);
                    },
                    error => {
                        reject(error);
                    });
        });
    }
     /**
     * Lists the fields of `collectionName` that are available for exploration with `arlasExploreApi`
     * @param collectionName collection name
     * @returns available fields
     */
    public listAvailableFields(collectionName: string): Promise<Set<string>> {
      let availableFields = new Set<string>();
      const hiddenAvailableFields = [];
      return this.collaborativesearchService.list(false).toPromise().then(
        (collectionDescriptions: Array<CollectionReferenceDescription>) => {
          collectionDescriptions.filter((cd: CollectionReferenceDescription) => cd.collection_name === collectionName)
          .forEach((cd: CollectionReferenceDescription) => {
            availableFields = new Set(getFieldProperties(cd.properties).map(p => {
              if (p.type === 'GEO_POINT') {
                hiddenAvailableFields.push(p.label + '.lon');
                hiddenAvailableFields.push(p.label + '.lat');
              }
              return p.label;
            }));
            availableFields.add(cd.params.id_path);
            availableFields.add(cd.params.timestamp_path);
            availableFields.add(cd.params.geometry_path);
            availableFields.add(cd.params.centroid_path);
            hiddenAvailableFields.forEach(f => availableFields.add(f));
        });
        return availableFields;
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
                }
                const contributor = ContributorBuilder.buildContributor(contributorType,
                    contributorIdentifier,
                    this.configService,
                    this.collaborativesearchService);
                this.contributorRegistry.set(contributorIdentifier, contributor);
            });
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


    public load(): Promise<any> {
      return this.applyAppSettings()
        .then((s: ArlasSettings) => this.getAppConfigurationObject(s))
        .then((data) => this.translationLoaded(data))
        .then((data) => this.setConfigService(data))
        .then((data) => this.applyFGA(data, this.useAuthent === true))
        .then((data) => this.setCollaborativeService(data, this.useAuthent === true))
        .then((data) => this.testArlasUp(data))
        .then((data) => this.getCollections(data))
        .then((data) => this.buildContributor(data))
        .catch((err: any) => {
            this.shouldRunApp = false;
            console.error(err);
            let message = '';
            if (err.url) {
              message = '- A server error occured \n' + '   - url: ' + err.url + '\n' + '   - status : ' + err.status;
            } else {
              message = err.toString();
            }
            const error = {
                origin: 'ARLAS-wui runtime',
                message: message,
                reason: ''
            };
            this.errorsQueue.push(error);
            return Promise.resolve(null);
        }).then((x) => { });
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

    /**
     * Retrieves fields that are available for exploration and updates the configuration to keep only corresponding widgets and components
     * @param data configuration object
     * @param collectionName Name of the explored collection
     * @param useAuthent whether authentication is activated or not.
     *
     * @code 001
     */
    private applyFGAPromise(data, collectionName, useAuthent) {
      return this.listAvailableFields(collectionName)
                    .then((availableFields: Set<string>) => this.updateConfiguration(data[0], availableFields))
                    .then((d) => { this.configService.setConfig(d); return [d, useAuthent]; })
                    .catch(err => {
                      this.shouldRunApp = false;
                      console.error(err);
                      const error = {
                          origin: 'ARLAS-wui runtime: an error occured while updating the configuration. Code: 001',
                          message: err.message,
                          reason: 'Please feel free to create an issue in "https://github.com/gisaia/ARLAS-wui-toolkit/issues"'
                      };
                      this.errorsQueue.push(error);
                      return Promise.resolve(null);
                    });
    }

}

export interface ExtraConfig {
    configPath: string;
    replacedAttribute: string;
    replacer: string;
}

export interface ArlasSettings {
  authentication?: AuthentSetting;
}


