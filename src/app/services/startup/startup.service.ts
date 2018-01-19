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
import * as rootContributorConf from '../../../../node_modules/arlas-web-contributors/jsonSchemas/rootContributorConf.schema.json';



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
    private config: Object;

    constructor(private http: Http,
        private configService: ArlasConfigService,
        private collaborativesearchService: ArlasCollaborativesearchService) {
    }



    public load(configRessource: string): Promise<any> {
        this.config = {};
        const ret = this.http
            .get(configRessource)
            .map((res: Response) => {
                return res.json();
            })
            .toPromise()
            .then((data: any) => {
                this.config = data;
                this.configService.setConfig(data);
                let validate;
                const confErrorMessage: Array<String> = [];
                Object.keys(this.configService.getValue('arlas.web.contributors')).forEach(key => {
                    const contributorType = key.split('$')[0];
                    validate = this.checkJsonWithSchema(contributorType);
                    const configValue = this.configService.getValue('arlas.web.contributors')[key];
                    if (validate(configValue) === false) {
                        this.shouldRunApp = false;
                        confErrorMessage.push('arlas.web.contributors.' + key + '' +
                            validate.errors[0].dataPath + ' ' +
                            validate.errors[0].message
                        );
                    }
                });
                if (this.shouldRunApp) {
                    this.collaborativesearchService.setConfigService(this.configService);
                    const configuraiton: Configuration = new Configuration();
                    const arlasExploreApi: ExploreApi = new ExploreApi(this.http,
                        this.configService.getValue('arlas.server.server$default.url'),
                        configuraiton
                    );
                    this.collaborativesearchService.setExploreApi(arlasExploreApi);
                    this.collaborativesearchService.collection = this.configService.getValue('arlas.server.collection$default.collection');
                    this.collaborativesearchService.max_age = this.configService.getValue('arlas.server.max_age$default.max_age');
                    Object.keys(this.configService.getValue('arlas.web.contributors')).forEach(key => {
                        const contributorType = key.split('$')[0];
                        const contributorIdentifier = key.split('$')[1];
                        if (contributorType === 'resultlist') {
                            this.selectorById = contributorIdentifier;

                        } else if (contributorType === 'histogram') {
                            const aggregationmodels = this.configService.getValue('arlas.web.contributors')[key]['aggregationmodels'];
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
                    this.collectionId = this.configService.getValue('arlas.server.collection$default.id');
                    this.analytics = this.configService.getValue('arlas.web.analytics');

                } else {
                    this.configService.setConfig({ error: confErrorMessage });
                }
            })
            .catch((err: any) => {
                return Promise.resolve(null);
            });
        return ret.then((x) => {
        });
    }


    private checkJsonWithSchema(contributorType: string): Function {
        const schema = this.getSchemaFileFromContributor(contributorType);
        const validate = ajv().addSchema(rootContributorConf).compile(schema);
        return validate;

    }

    private getSchemaFileFromContributor(contributorType: string): any {
        return contributors.get(contributorType).getJsonSchema();
    }
}
