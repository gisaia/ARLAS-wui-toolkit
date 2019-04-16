import { Injectable } from '@angular/core';
import { ArlasConfigService, ArlasCollaborativesearchService, ArlasExploreApi, ArlasCollectionApi } from '../startup/startup.service';
import { Observable, from } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { Configuration, CollectionReference } from 'arlas-api';
import * as portableFetch from 'portable-fetch';


@Injectable()
export class ArlasConfigurationDescriptor {

  constructor(private collaborativesearchService: ArlasCollaborativesearchService, private configService: ArlasConfigService) {}

  public getAllCollections(): Observable<Array<string>> {
    const configuration: Configuration = new Configuration();
    const arlasCollectionsApi = new ArlasCollectionApi(
      configuration,
      this.configService.getValue('arlas.server.url'),
      portableFetch
    );
    return <Observable<Array<string>>>from(arlasCollectionsApi.getAll1()).pipe(
      map((collections: Array<CollectionReference>) => collections.map((collection: CollectionReference) => collection.collection_name).filter(collection => collection !== 'metacollection'))
    );
  }

  /**
   *
   * @param types
   * @description Returns all the fields which types are in `types` param. If no `types` is specified, then all the fields are returned
   */
  public getFields(types?: Array<string>): Observable<any> {
    return this.collaborativesearchService.describe(this.configService.getValue('arlas.server.collection.name')).pipe(
      map(description => this.getFieldProperties(description.properties)),
      map(fields => types ? fields.filter(field => types.find(type => type == field.type) !== undefined).map(field => field.label)
        : fields.map(field => field.label))
    );
  }

  private getFieldProperties(fieldList: any, parentPrefix?: string, arlasFields?: Array<{label: string, type: string}>, isFirstLevel?: boolean ) {
    if (!arlasFields) {
      arlasFields = new Array();
    }
    if (isFirstLevel === undefined)  {
      isFirstLevel = true;
    }
    Object.keys(fieldList).forEach(fieldName => {
      if (fieldList[fieldName].type === 'OBJECT') {
        const subFields = fieldList[fieldName].properties;
        if (subFields) {
          this.getFieldProperties(subFields,  (parentPrefix ? parentPrefix : '') + fieldName + '.', arlasFields, false);
        }
      } else {
        arlasFields.push({ label: (parentPrefix ? parentPrefix : '') + fieldName, type: fieldList[fieldName].type });
      }
    });

    if (isFirstLevel) {
      return arlasFields;
    }
  }
}
