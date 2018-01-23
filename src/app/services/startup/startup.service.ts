import { ContributorBuilder } from './contributorBuilder';
import { HistogramComponent } from 'arlas-web-components';
import { HistogramData } from 'arlas-web-components/histogram/histogram.utils';
import {
    HistogramContributor,
    MapContributor,
    PowerbarsContributor,
    ResultListContributor,
    SwimLaneContributor
} from 'arlas-web-contributors';
import { ConfigService, CollaborativesearchService } from 'arlas-web-core';
import { contributors } from 'arlas-web-contributors';
import { Injectable, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import { Configuration } from 'arlas-api';
import { ExploreApi } from 'arlas-api';
import * as ajv from 'ajv';
import * as rootContributorConfSchema from '../../../../node_modules/arlas-web-contributors/jsonSchemas/rootContributorConf.schema.json';
import * as arlasConfSchema from './arlasconfig.schema.json';
import { ChipsSearchContributor } from 'arlas-web-contributors/contributors/ChipsSearchContributor';
import { PowerbarsComponent } from 'arlas-web-components/powerbars/powerbars.component';
import { projType } from 'arlas-web-core/models/projections';



@Injectable()
export class ArlasConfigService extends ConfigService {
    constructor() {
        super();
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

    constructor(private http: Http,
        private configService: ArlasConfigService,
        private collaborativesearchService: ArlasCollaborativesearchService) {
    }

    public load(configRessource: string): Promise<any> {
        const ret = this.http
            .get(configRessource)
            .map((res: Response) => {
                return res.json();
            })
            .toPromise()
            .then((data: any) => {
                const confErrorMessage: Array<String> = [];
                const validateConfig = ajv()
                    .addSchema(rootContributorConfSchema)
                    .addSchema(HistogramContributor.getJsonSchema())
                    .addSchema(SwimLaneContributor.getJsonSchema())
                    .addSchema(PowerbarsContributor.getJsonSchema())
                    .addSchema(ResultListContributor.getJsonSchema())
                    .addSchema(MapContributor.getJsonSchema())
                    .addSchema(ChipsSearchContributor.getJsonSchema())
                    .addSchema(HistogramComponent.getHistogramJsonSchema())
                    .addSchema(HistogramComponent.getSwimlaneJsonSchema())
                    .addSchema(PowerbarsComponent.getPowerbarsJsonSchema())
                    .compile(arlasConfSchema);
                if (validateConfig(data) === false) {
                    this.shouldRunApp = false;
                    confErrorMessage.push(
                        validateConfig.errors[0].dataPath + ' ' +
                        validateConfig.errors[0].message
                    );
                    this.configService.setConfig({ error: confErrorMessage });

                } else {
                    this.configService.setConfig(data);
                    this.collaborativesearchService.setConfigService(this.configService);
                    const configuraiton: Configuration = new Configuration();
                    const arlasExploreApi: ExploreApi = new ExploreApi(this.http,
                        this.configService.getValue('arlas.server.url'),
                        configuraiton
                    );
                    this.collaborativesearchService.setExploreApi(arlasExploreApi);
                    this.collaborativesearchService.collection = this.configService.getValue('arlas.server.collection.name');
                    this.collaborativesearchService.max_age = this.configService.getValue('arlas.server.max_age');
                    this.collaborativesearchService.resolveHits([projType.count, {}]).finally(() => {
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
                        .subscribe(
                        result => this.shouldRunApp = true,
                        error => {
                            this.shouldRunApp = false;
                            alert('Unreachable ARLAS Server : ' + this.configService.getValue('arlas.server.url'));
                        }
                        );
                }
            })
            .catch((err: any) => {
                console.log(err);
                return Promise.resolve(null);
            });
        return ret.then((x) => {
        });
    }
}
