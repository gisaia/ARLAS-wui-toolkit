import { DataType, DateUnit } from 'arlas-web-contributors/models/models';
import {
    HistogramContributor,
    PowerbarsContributor,
    ResultListContributor,
    SwimLaneContributor
} from 'arlas-web-contributors';
import { ArlasConfigService, ArlasCollaborativesearchService } from './startup.services';

export class ContributorBuilder {
    public static buildContributor(contributorType: string,
        identifier: string,
        configService: ArlasConfigService,
        collaborativesearchService: ArlasCollaborativesearchService): any {
        const config: Object = configService.getValue('arlas.web.contributors')[contributorType + '$' + identifier];
        let contributor;
        let dateunit: string;
        let datatype: string;
        let isOneDimension: boolean;
        switch (contributorType) {
            case 'histogram':
                dateunit = config['dateunit'];
                datatype = config['datatype'];
                isOneDimension = config['isOneDimension'];
                contributor = new HistogramContributor(identifier,
                    DateUnit[dateunit],
                    DataType[datatype],
                    collaborativesearchService,
                    configService, isOneDimension);
                break;
            case 'powerbars':
                const title: string = config['title'];
                contributor = new PowerbarsContributor(identifier,
                    collaborativesearchService,
                    configService,
                    title);
                break;
            case 'resultlist':
                contributor = new ResultListContributor(identifier,
                    collaborativesearchService,
                    configService);
                break;
            case 'map':
                // TO DO
                break;
            case 'swimlane':
                dateunit = config['dateunit'];
                datatype = config['datatype'];
                isOneDimension = config['isOneDimension'];
                contributor = new SwimLaneContributor(identifier,
                    DateUnit[dateunit],
                    DataType[datatype],
                    collaborativesearchService,
                    configService);
                break;
            case 'chipsearch':
                // TO DO
                break;
        }
        return contributor;
    }
}
