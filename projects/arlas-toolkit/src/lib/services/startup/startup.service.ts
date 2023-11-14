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

import { LOCATION_INITIALIZED } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, InjectionToken, Injector } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import Ajv from 'ajv';
import ajvKeywords from 'ajv-keywords';
import * as draftSchema from 'ajv/lib/refs/json-schema-draft-06.json';
import { CollectionReferenceDescription, CollectionReferenceParameters, CollectionsApi, Configuration, ExploreApi } from 'arlas-api';
import { Configuration as IamConfiguration, DefaultApi } from 'arlas-iam-api';
import { DataWithLinks } from 'arlas-persistence-api';
import { DonutComponent, HistogramComponent, MapglComponent, MetricComponent, PowerbarsComponent } from 'arlas-web-components';
import {
  ChipsSearchContributor, ComputeContributor, DetailedHistogramContributor, HistogramContributor,
  MapContributor,
  ResultListContributor,
  SwimLaneContributor, TreeContributor
} from 'arlas-web-contributors';
import { AnalyticsContributor } from 'arlas-web-contributors/contributors/AnalyticsContributor';
import * as rootContributorConfSchema from 'arlas-web-contributors/jsonSchemas/rootContributorConf.schema.json';
import { CollaborativesearchService, ConfigService, Contributor } from 'arlas-web-core';
import { projType } from 'arlas-web-core/models/projections';
import YAML from 'js-yaml';
import { Subject } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { PersistenceService, PersistenceSetting } from '../persistence/persistence.service';
import { CONFIG_ID_QUERY_PARAM, GET_OPTIONS, WidgetConfiguration, getFieldProperties,
  AuthentSetting, NOT_CONFIGURED, getParamValue } from '../../tools/utils';
import { ArlasIamService, IamHeader } from '../arlas-iam/arlas-iam.service';
import { AuthentificationService, } from '../authentification/authentification.service';
import { ArlasConfigurationUpdaterService } from '../configuration-updater/configurationUpdater.service';
import { ErrorService } from '../error/error.service';
import { FetchInterceptorService } from '../interceptor/fetch-interceptor.service';
import { PermissionService, PermissionSetting } from '../permission/permission.service';
import { ArlasSettingsService } from '../settings/arlas.settings.service';
import * as arlasConfSchema from './arlasconfig.schema.json';
import { ContributorBuilder } from './contributorBuilder';
import * as arlasSettingsSchema from './settings.schema.json';
import { FilterShortcutConfiguration } from '../../components/filter-shortcut/filter-shortcut.utils';
import { AnalyticGroupConfiguration } from '../../components/analytics/analytics.utils';
import { ArlasAuthentificationService } from '../arlas-authentification/arlas-authentification.service';
import { Filter } from 'arlas-api';
import { ProcessService } from '../process/process.service';

@Injectable({
  providedIn: 'root'
})
export class ArlasConfigService extends ConfigService {
  public errorsQueue = new Array<Error>();
  public appName = '';
  public constructor() {
    super();
  }
}

@Injectable()
export class ArlasExploreApi extends ExploreApi {
  public constructor(@Inject('CONF') conf: Configuration, @Inject('base_path') basePath: string,
    @Inject('fetch') fetch) {
    super(conf, basePath, fetch);
  }
}

@Injectable()
export class ArlasCollectionApi extends CollectionsApi {
  public constructor(@Inject('CONF') conf: Configuration, @Inject('base_path') basePath: string,
    @Inject('fetch') fetch) {
    super(conf, basePath, fetch);
  }
}

@Injectable()
export class ArlasIamApi extends DefaultApi {
  public constructor(@Inject('CONF') conf: IamConfiguration, @Inject('base_path') basePath: string,
    @Inject('fetch') fetch) {
    super(conf, basePath, fetch);
  }
}

@Injectable()
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
        collab.filters.set(defaultCollection, [Object.assign({}, collab.filter)]);
        delete collab.filter;
      }
      if (contributor && contributor instanceof TreeContributor && changeOperator) {
        collab.filters.forEach((filters: any[], collection: string) => {
          const exp = filters[0].f[0][0];
          const op = exp.op;
          if (op !== contributor.getFilterOperator()) {
            if (contributor.allowOperatorChange) {
              contributor.setFilterOperator(op, true);
            } else {
              delete dataModel['' + key];
              this.collaborations.delete(key);
            }
          }
        });
      }
    });
    return dataModel;
  }

  public getFilters(collection: string): Array<Filter> {
    const filters: Filter[] = [];
    Array.from(this.collaborations.values()).forEach(c => {
      filters.push(...c.filters.get(collection));
    });
    return filters;
  }
}

export const CONFIG_UPDATER = new InjectionToken<Function>('config_updater');
export const FETCH_OPTIONS = new InjectionToken<any>('fetch_options');

export interface Error {
  origin: string;
  message: string;
  reason: string;
}
export const SETTINGS_FILE_NAME = 'settings.yaml?' + Date.now();

@Injectable()
export class ArlasStartupService {
  public contributorRegistry: Map<string, Contributor> = new Map<string, any>();
  public shouldRunApp = true;
  public emptyMode = false;
  public analytics: Array<AnalyticGroupConfiguration>;
  public filtersShortcuts: Array<FilterShortcutConfiguration>;
  public collectionsMap: Map<string, CollectionReferenceParameters> = new Map();
  public collectionId: string;
  public selectorById: string;
  public temporalContributor: Array<string> = new Array<string>();
  private errorMessagesList = new Array<string>();
  public errorStartUpServiceBus: Subject<any> = new Subject<any>();
  public arlasIsUp: Subject<boolean> = new Subject<boolean>();
  public arlasExploreApi: ArlasExploreApi;
  public configurationUpdaterService: ArlasConfigurationUpdaterService;
  public arlasIamApi: ArlasIamApi;

  public constructor(
    private settingsService: ArlasSettingsService,
    private configService: ArlasConfigService,
    private collaborativesearchService: ArlasCollaborativesearchService,
    private injector: Injector,
    @Inject(FETCH_OPTIONS) private fetchOptions,
    @Inject(GET_OPTIONS) private getOptions,
    private http: HttpClient, private translateService: TranslateService,
    @Inject(CONFIG_UPDATER) private configUpdater,
    private persistenceService: PersistenceService,
    private permissionService: PermissionService,
    private errorService: ErrorService, private fetchInterceptorService: FetchInterceptorService,
    private arlasIamService: ArlasIamService,
    private arlasAuthService: ArlasAuthentificationService,
    private processService: ProcessService
  ) {
    this.configurationUpdaterService = new ArlasConfigurationUpdaterService;
  }

  public getFGAService(): ArlasConfigurationUpdaterService {
    return this.configurationUpdaterService;
  }

  public errorStartUp() {
    this.errorStartUpServiceBus.subscribe(e => console.error(e));
  }


  public validateSettings(settings) {
    return new Promise<any>((resolve, reject) => {
      const ajvObj = new Ajv();
      ajvKeywords(ajvObj, 'uniqueItemProperties');
      const validateConfig = ajvObj
        .addMetaSchema(draftSchema.default)
        .compile((<any>arlasSettingsSchema).default);
      if (settings && validateConfig(settings) === false) {
        const errorMessagesList = new Array<string>();
        errorMessagesList.push(
          validateConfig.errors[0].schemaPath + ' ' +
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
      const ajvObj = new Ajv();
      ajvKeywords(ajvObj, 'uniqueItemProperties');
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
          validateConfig.errors[0].schemaPath + ' ' +
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
      // Set default language to current browser language
      let langToSet = navigator.language.slice(0, 2);
      const urlLanguage = getParamValue('lg');
      if (urlLanguage) {
        langToSet = decodeURIComponent(urlLanguage.replace(/\+/g, ' '));
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

  /**
   * - Sets the configuration object in ArlasConfigService.
   * - Sets the ArlasConfigService instance in ArlasCollaborativeSearchService
   * @param data configation object
   * @returns the same configuration object
   */
  public setConfigService(data) {
    /** First set the raw config data in order to create an ArlasExploreApi instance */
    const configAfterUpdater = this.configUpdater(data);
    const newConfig = this.fixLayerStyleInfinity(configAfterUpdater);
    if (!this.emptyMode) {
      this.configService.setConfig(newConfig);
      this.collaborativesearchService.setFetchOptions(this.fetchOptions);
      const arlasUrl = this.configService.getValue('arlas.server.url');
      const configuration: Configuration = new Configuration();
      this.arlasExploreApi = new ArlasExploreApi(
        configuration,
        arlasUrl,
        window.fetch
      );
      this.collaborativesearchService.setConfigService(this.configService);
      this.collaborativesearchService.setExploreApi(this.arlasExploreApi);
    }
    return data;
  }

  /**
   * Updates configuration by keeping only components/widgets that are availbale for exploration
   * @param data configuration object
   * @param availableFields list of fields that are available for exploration
   * @returns the updated configuration object
   */
  public updateConfiguration(data, availableFields: Set<string>): any {
    if (!this.emptyMode) {
      const contributorsToRemove: Set<string> = this.configurationUpdaterService.getContributorsToRemove(data, availableFields);
      let updatedConfig = this.configurationUpdaterService.removeContributors(data, contributorsToRemove);
      updatedConfig = this.configurationUpdaterService.updateContributors(updatedConfig, availableFields);
      updatedConfig = this.configurationUpdaterService.updateMapComponent(updatedConfig, availableFields);
      updatedConfig = this.configurationUpdaterService.removeWidgets(updatedConfig, contributorsToRemove);
      updatedConfig = this.configurationUpdaterService.removeTimelines(updatedConfig, contributorsToRemove);
      return updatedConfig;
    } else {
      return data;
    }
  }

  /**
   * Retrieves fields that are available for exploration and updates the configuration to keep only corresponding widgets and components
   * @param data configuration object
   */
  public applyFGA(data) {
    if (!this.emptyMode) {
      const defaultCollection = this.configService.getValue('arlas.server.collection.name');
      const collectionNames: Set<string> = new Set(this.configService.getValue('arlas.web.contributors')
        .map(c => (c.collection as string)));
      collectionNames.add(defaultCollection);
      return this.listAvailableFields(collectionNames)
        .then((availableFields: Set<string>) => this.updateConfiguration(data[0], availableFields))
        .then((d) => {
          this.configService.setConfig(d);
          return d;
        })
        .catch(err => {
          this.shouldRunApp = false;
          console.error(err);
          const error = {
            origin: 'ARLAS-wui runtime: an error occured while updating the configuration. Code: 001',
            message: err.message,
            reason: 'Please feel free to create an issue in "https://github.com/gisaia/ARLAS-wui-toolkit/issues"'
          };
          this.errorService.errorsQueue.push(error);
          return Promise.resolve(null);
        });
    } else {
      return Promise.resolve({});
    }
  }

  /**
   * - Fetches and parses the `settings.yaml`.
   * - Validates it against the correponding schema
   * @returns ARLAS settings object Promise
   */
  public applyAppSettings(): Promise<ArlasSettings> {
    return this.http.get(SETTINGS_FILE_NAME, { responseType: 'text', headers: { 'X-Skip-Interceptor': '' } }).toPromise()
      .catch((err) => {
        // application should not run if the settings.yaml file is absent
        this.shouldRunApp = false;
        console.error(err);
        const error: Error = {
          origin: SETTINGS_FILE_NAME + ' file',
          message: 'Cannot read "' + SETTINGS_FILE_NAME + '" file',
          reason: 'Please check if "' + SETTINGS_FILE_NAME + '" is in "src" folder'
        };
        this.errorService.errorsQueue.push(error);
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
          origin: 'ARLAS-wui `' + SETTINGS_FILE_NAME + '` file',
          message: err.toString().replace('Error:', ''),
          reason: 'Please check that the `src/' + SETTINGS_FILE_NAME + '` file is valid.'
        };
        this.errorService.errorsQueue.push(error);
        return Promise.reject(err);
      })
      .then(s => {
        this.settingsService.setSettings(s);
        this.persistenceService.createPersistenceApiInstance();
        this.permissionService.createPermissionApiInstance();
        return s;
      });
  }
  /**
   * if authentication is configured, trigger authentication service that redirects to login page if it's the first time and fetches
   * the appropriate token
   * @param settings ArlasSettings object
   */
  public authenticate(settings: ArlasSettings): Promise<ArlasSettings> {
    return (new Promise<ArlasSettings>((resolve, reject) => {
      // if authentication is configured, trigger authentication service that
      // redirects to login page if it's the first time and fetches the appropriate token
      if (settings) {
        const authent: AuthentSetting = settings.authentication;
        if (authent && authent.use_authent && authent.auth_mode === 'iam') { // Authentication activated with IAM mode
          if (!this.arlasIamService.areSettingsValid(authent)[0]) {
            const err = 'Authentication is set while ' + this.arlasIamService.areSettingsValid(authent)[1] + ' are not configured';
            return reject(err);
          }
          this.arlasIamApi = new ArlasIamApi(new IamConfiguration(), authent.url, window.fetch);
          this.arlasIamService.setArlasIamApi(this.arlasIamApi);

          return resolve(this.arlasIamService.initAuthService().then(() => settings));
        } else if (authent && authent.use_authent) { // Authentication activated with OPENID mode
          const authService: AuthentificationService = this.injector.get('AuthentificationService')[0];
          authService.authConfigValue = authent;
          if (!authService.areSettingsValid(authent)[0]) {
            const err = 'Authentication is set while ' + authService.areSettingsValid(authent)[1] + ' are not configured';
            return reject(err);
          }
          return resolve(authService.initAuthService().then(() => settings));
        }
      }
      return resolve(settings);
    })).catch((err: any) => {
      // application should not run if the settings.yaml file is not valid
      this.shouldRunApp = false;
      console.error(err);
      const error = {
        origin: 'ARLAS-wui `' + SETTINGS_FILE_NAME + '` file',
        message: err.toString().replace('Error:', ''),
        reason: 'Please check if authentication is well configured in `' + SETTINGS_FILE_NAME + '` file .'
      };
      this.errorService.errorsQueue.push(error);
      throw new Error(err);
    });
  }

  public enrichServicesIamsHeaders(): void {
    const accessToken = this.arlasIamService.getAccessToken();
    const arlasOrganisation = this.arlasIamService.getOrganisation();
    const iamHeader: IamHeader = {
      Authorization: 'Bearer ' + accessToken,
      'arlas-org-filter': arlasOrganisation
    };
  }

  /**
   * Enriches headers of calls sent to ARLAS-server & ARLAS-persistence
   * @param settings
   */
  public enrichHeaders(settings: ArlasSettings): Promise<ArlasSettings> {
    return new Promise<ArlasSettings>((resolve, reject) => {
      const useAuthent = !!settings && !!settings.authentication
        && !!settings.authentication.use_authent;
      // The default behavior is openid, so if there is no auth_mode specified, it is openid
      const useAuthentOpenID = useAuthent && settings.authentication.auth_mode !== 'iam';
      const useAuthentIam = useAuthent && settings.authentication.auth_mode === 'iam';
      if (useAuthent) {
        const usePersistence = (!!settings && !!settings.persistence && !!settings.persistence.url
          && settings.persistence.url !== '' && settings.persistence.url !== NOT_CONFIGURED);

        if (useAuthentOpenID) {
          const authService: AuthentificationService = this.injector.get('AuthentificationService')[0];
          if (usePersistence) {
            // To open reconnect dialog on silent refresh failed
            authService.silentRefreshErrorSubject.subscribe(error =>
              // eslint-disable-next-line arrow-body-style
              this.persistenceService.list('config.json', 10, 1, 'asc').subscribe(data => {
                return;
              }));
          }
          this.fetchInterceptorService.applyInterceptor();
          authService.canActivateProtectedRoutes.subscribe(isActivable => {
            if (isActivable) {
              // ARLAS-persistence
              this.persistenceService.setOptions({
                headers: {
                  Authorization: 'bearer ' + authService.accessToken
                }
              });
              // ARLAS-server
              this.fetchOptions.headers = {
                Authorization: 'bearer ' + authService.accessToken
              };
              // ARLAS-Permission
              this.permissionService.setOptions({
                headers: {
                  Authorization: 'bearer ' + authService.accessToken
                }
              });
              // Process
              this.processService.setOptions({
                headers: {
                  Authorization: 'bearer ' + authService.accessToken
                }
              });
            } else {
              this.persistenceService.setOptions(this.getOptions());
              this.permissionService.setOptions(this.getOptions());
              this.processService.setOptions(this.getOptions());
            }
            this.collaborativesearchService.setFetchOptions(this.fetchOptions);
            resolve(settings);
          });

        } else if (useAuthentIam) {
          const url = new URL(window.location.href);
          const paramOrg = url.searchParams.get('org');
          if (!!paramOrg) {
            this.arlasIamService.storeOrganisation(paramOrg);
          }
          this.arlasIamService.tokenRefreshed$.subscribe({
            next: (loginData) => {
              if (!!loginData) {
                const org = this.arlasIamService.getOrganisation();
                const iamHeader = {
                  Authorization: 'Bearer ' + loginData.accessToken,
                };
                // Set the org filter only if the organisation is defined
                if (!!org) {
                  iamHeader['arlas-org-filter'] = org;
                }
                this.persistenceService.setOptions({ headers: iamHeader });
                this.permissionService.setOptions({ headers: iamHeader });
                this.processService.setOptions({ headers: iamHeader });
                this.fetchOptions.headers = iamHeader;
              } else {
                this.persistenceService.setOptions({});
                this.permissionService.setOptions({});
                this.processService.setOptions({});
              }
              this.collaborativesearchService.setFetchOptions(this.fetchOptions);
              resolve(settings);
            }
          });
        }
      } else {
        this.persistenceService.setOptions(this.getOptions());
        this.permissionService.setOptions(this.getOptions());
        this.collaborativesearchService.setFetchOptions(this.fetchOptions);
        resolve(settings);
      }
    });
  }
  /**
   * - Fetches the configuration file from ARLAS-persistence if it's configurated, otherwise fetches the config.json in "src" folder.
   * - Validates the configuration against the corresponding schema
   * @param settings Arlas Settings object
   * @returns ARLAS Configuration object Promise
   */
  public getAppConfigurationObject(settings: ArlasSettings): Promise<any> {
    const url = new URL(window.location.href);
    const usePersistence = (!!settings && !!settings.persistence && !!settings.persistence.url
      && settings.persistence.url !== '' && settings.persistence.url !== NOT_CONFIGURED && !settings.persistence.use_local_config);
    const configurationId = url.searchParams.get(CONFIG_ID_QUERY_PARAM);
    return new Promise<any>((resolve, reject) => {
      let configDataPromise = Promise.resolve(null);
      let configData;
      if (usePersistence) {
        if (!!configurationId) {
          configDataPromise = this.persistenceService.get(configurationId).toPromise()
            .then((s: DataWithLinks) => {
              const config = JSON.parse(s.doc_value);
              this.configService.appName = s.doc_key;
              configData = config;
              return Promise.resolve(config);
            }).catch((err) => {
              if (err.toString() === 'TypeError: Failed to fetch') {
                this.shouldRunApp = false;
                console.error(err);
                const error: Error = {
                  origin: 'ARLAS-persistence is unreachable',
                  message: 'Cannot reach ARLAS-persistence at the configured URL',
                  reason: 'Please check if ARLAS-persistence is up & running'
                };
                this.errorService.errorsQueue.push(error);
              } else {
                // this mode will allow us to start an
                this.emptyMode = true;
                this.fetchInterceptorService.interceptInvalidConfig({
                  id: configurationId,
                  error: err
                });
                return Promise.resolve(null);
              }
            });
        } else {
          this.emptyMode = true;
        }
      } else {
        // persistence is not used, we use the config.json file mounted
        configDataPromise = this.http
          .get('config.json')
          .pipe(mergeMap((response) => {
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
      resolve(configDataPromise.then(configObject => {
        if (!this.emptyMode) {
          return this.validateConfiguration(configObject);
        } else {
          return Promise.resolve({});
        }
      }));
    });
  }

  public setCollaborativeService(data) {
    if (!this.emptyMode) {
      return new Promise<any>((resolve, reject) => {
        this.collaborativesearchService.setConfigService(this.configService);
        this.collaborativesearchService.setExploreApi(this.arlasExploreApi);
        this.collaborativesearchService.defaultCollection = this.configService.getValue('arlas.server.collection.name');
        const maxAge = this.configService.getValue('arlas.server.max_age_cache');
        this.collaborativesearchService.max_age = maxAge !== undefined ? maxAge : 120;
        resolve(data);
      });
    }
  }

  public testArlasUp(configData) {
    if (!this.emptyMode) {
      return new Promise<any>((resolve, reject) => {
        this.collaborativesearchService.resolveHits([projType.count, {}], this.collaborativesearchService.collaborations,
          this.collaborativesearchService.defaultCollection)
          .subscribe(
            result => {
              resolve(result);
            },
            error => {
              reject(error);
            });
      });
    } else {
      return Promise.resolve(configData);
    }
  }

  public getCollections(data) {
    if (!this.emptyMode) {
      return new Promise<any>((resolve, reject) => {
        const collectionName = data.collection;
        this.collaborativesearchService.list()
          .subscribe(
            allCollections => {
              // mainCollection is included in allCollections
              allCollections.forEach(c => this.collectionsMap.set(c.collection_name, c.params));

              this.collectionId = allCollections.find(c => c.collection_name === collectionName).params.id_path;
              resolve(allCollections);
            },
            error => {
              reject(error);
            });
      });
    } else {
      return Promise.resolve(data);
    }
  }
  /**
  * Lists the fields of `collectionName` that are available for exploration with `arlasExploreApi`
  * @param collectionName collection name
  * @returns available fields
  */
  public listAvailableFields(collectionNames: Set<string>): Promise<Set<string>> {
    const availableFields = new Set<string>();
    const hiddenAvailableFields = [];
    return this.collaborativesearchService.list().toPromise().then(
      (collectionDescriptions: Array<CollectionReferenceDescription>) => {
        collectionDescriptions.filter((cd: CollectionReferenceDescription) => collectionNames.has(cd.collection_name))
          .forEach((cd: CollectionReferenceDescription) => {
            getFieldProperties(cd.properties).map(p => {
              if (p.type === 'GEO_POINT') {
                hiddenAvailableFields.push(p.label + '.lon');
                hiddenAvailableFields.push(p.label + '.lat');
              }
              return p.label;
            }).forEach(label => availableFields.add(label));
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
    if (!this.emptyMode) {
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
            this.collaborativesearchService,
            this.settingsService);
          this.contributorRegistry.set(contributorIdentifier, contributor);
        });
        this.analytics = this.configService.getValue('arlas.web.analytics');
        this.filtersShortcuts = this.configService.getValue('arlas.web.filters_shortcuts');
        if (this.filtersShortcuts) {
          this.filtersShortcuts.forEach(fs => {
            fs.component = this.getShortcutComponent(fs.uuid);
          });
        }
        this.arlasIsUp.next(true);
        resolve(data);
      });
    } else {
      return Promise.resolve(data);
    }
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

  public changeOrgHeader(org: string, accessToken: string) {
    this.arlasIamService.setHeaders(org, accessToken);
    const headers: IamHeader = {
      Authorization: 'Bearer ' + accessToken,
      'arlas-org-filter': org,
    };
    this.persistenceService.setOptions({ headers });
    this.permissionService.setOptions({ headers });
    this.fetchOptions.headers = headers;
    this.collaborativesearchService.setFetchOptions(this.fetchOptions);
  }


  public load(): Promise<any> {
    return this.applyAppSettings()
      .then((s: ArlasSettings) => this.authenticate(s))
      .then((s: ArlasSettings) => this.enrichHeaders(s))
      .then((s: ArlasSettings) => this.getAppConfigurationObject(s))
      .then((data) => this.translationLoaded(data))
      .then((data) => this.setConfigService(data))
      .then((data) => this.applyFGA(data))
      .then((data) => this.setCollaborativeService(data))
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
        const error: Error = {
          origin: 'ARLAS-wui runtime',
          message: message,
          reason: ''
        };
        this.errorService.errorsQueue.push(error);
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

  private getShortcutComponent(uuid: string) {
    let component: WidgetConfiguration;
    for (const g of this.analytics) {
      let clonedComponent: WidgetConfiguration;
      component = g.components.find(c => c.uuid === uuid);
      if (!!component) {
        if (component.componentType === 'histogram') {
          clonedComponent = Object.assign({}, component);
          clonedComponent.contributorId = uuid;
          return clonedComponent;
        }
        break;
      }
    }
    return component;
  }

  private fixLayerStyleInfinity(config) {
    /** FIX wrong v15 map filters about Infinity values */
    if (!!config && !!config.arlas && !!config.arlas.web && !!config.arlas.web.components.mapgl) {
      const layers = config.arlas.web.components.mapgl.input.mapLayers.layers;
      layers.forEach(layer => {
        if (!!layer.filter && Array.isArray(layer.filter)) {
          const filters = [];
          layer.filter.forEach(expression => {
            if (Array.isArray(expression) && expression.length === 3) {
              if (expression[0] === '!=' && expression[2] === 'Infinity') {
                expression = ['<=', (expression[1] as any).replace(/\./g, '_'), Number.MAX_VALUE];
              } else if (expression[0] === '!=' && expression[2] === '-Infinity') {
                expression = ['>=', (expression[1] as any).replace(/\./g, '_'), -Number.MAX_VALUE];
              }
            }
            filters.push(expression);
          });
          layer.filter = filters;
        }
      });
    }
    return config;
  }
}

export interface ExtraConfig {
  configPath: string;
  replacedAttribute: string;
  replacer: string;
}

export interface ArlasSettings {
  authentication?: AuthentSetting;
  persistence?: PersistenceSetting;
  permission?: PermissionSetting;
  arlas_wui_url?: string;
  arlas_builder_url?: string;
  arlas_hub_url?: string;
  arlas_iam_wui_url?: string;
  links?: LinkSettings[];
  ticketing_key?: string;
  histogram?: HistogramSettings;
  process?: ProcessSettings;
}

export interface LinkSettings {
  name: string;
  url: string;
  icon: string;
}

export interface HistogramSettings {
  max_buckets: number;
  export_nb_buckets: number;
}

export interface ProcessSettings {
  url?: string;
  check_url?: string;
  max_items?: number;
  settings: {
    url: string;
  };
  status: {
    url: string;
  };
}


