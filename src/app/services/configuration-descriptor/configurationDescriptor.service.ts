import { Injectable } from '@angular/core';
import { ArlasConfigService, ArlasCollaborativesearchService } from '../startup/startup.service';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

@Injectable()
export class ArlasConfigurationDescriptor {


  constructor(private collaborativesearchService: ArlasCollaborativesearchService, private configService: ArlasConfigService) {
  }


  /**
   *
   * @param types
   * @description Returns all the fields which types are in `types` param. If no `types` is specified, then all the fields are returned
   */
  public getFields(types?: Array<string>):  Observable<any> {
    console.log('appel')
    return this.collaborativesearchService.describe(this.configService.getValue('arlas.server.collection.name')).pipe(
      map(description => { console.log('test'); return this.getFieldProperties(description.properties)}),
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
