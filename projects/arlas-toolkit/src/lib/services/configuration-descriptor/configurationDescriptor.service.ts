import { Injectable } from '@angular/core';
import { ArlasConfigService, ArlasCollaborativesearchService, ArlasExploreApi, ArlasCollectionApi } from '../startup/startup.service';
import { Observable, from } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { Configuration, CollectionReferenceDescription } from 'arlas-api';
import * as portableFetch from 'portable-fetch';
import { getFieldProperties } from '../../tools/utils';


@Injectable()
export class ArlasConfigurationDescriptor {

  public fetchOptions = {
    credentials: 'include'
  };

  constructor(
    private collaborativesearchService: ArlasCollaborativesearchService,
    private configService: ArlasConfigService,
  ) { }

  /**
   * @description Returns an Observable that contains the list of all collections
   * declared in ARLAS-server (that is configurated in env.js ( serverUrl )
   */
  public getAllCollections(): Observable<Array<string>> {
    return <Observable<Array<string>>>from(this.collaborativesearchService.list(false)).pipe(
      map(
        (collections: Array<CollectionReferenceDescription>) => collections.map(
          (collection: CollectionReferenceDescription) => collection.collection_name
        )
          .filter(collection => collection !== 'metacollection')
      )
    );
  }

  /**
   *
   * @param types
   * @description Returns an Observable that contains a list of the fields which types are in `types` param.
   * If no `types` are specified, then all the fields are returned.
   */
  public getFields(types?: Array<string>): Observable<Array<{ label: string, type: string }>> {
    const configuration: Configuration = new Configuration();
    const arlasExploreApi: ArlasExploreApi = new ArlasExploreApi(
      configuration,
      this.configService.getValue('arlas.server.url'),
      portableFetch
    );
    this.collaborativesearchService.setExploreApi(arlasExploreApi);
    return this.collaborativesearchService.describe(this.configService.getValue('arlas.server.collection.name')).pipe(
      filter(description => description.properties !== undefined),
      map(description => getFieldProperties(description.properties)),
      map(fields => types ? fields.filter(field => types.find(type => type === field.type) !== undefined)
        : fields)
    );
  }
}
