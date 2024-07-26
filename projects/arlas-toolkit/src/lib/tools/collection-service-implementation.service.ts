import { CollectionUnit } from './utils';
import { catchError, EMPTY, first, map, Observable } from 'rxjs';
import { BaseCollectionService } from 'arlas-web-components';
import { Injectable } from '@angular/core';
import { ArlasCollaborativesearchService, ArlasConfigService } from '../services/startup/startup.service';
import { CollectionReferenceDescription } from 'arlas-api';

@Injectable()
export class CollectionServiceImplementation extends BaseCollectionService {
  private appUnits: Map<string, CollectionUnit> = new Map();
  private displayName: Map<string, string> = new Map();
  public constructor(private collaborativeService: ArlasCollaborativesearchService, private configService: ArlasConfigService) {
    super();
    this._initUnits();
    this._initDisplayNames();
  }

  protected _initUnits() {
    const appUnits = this.configService.getValue('arlas-wui.web.app.units') ?
      this.configService.getValue('arlas-wui.web.app.units') : [];
    appUnits.forEach((collectionUnit: CollectionUnit) => this.appUnits.set(collectionUnit.collection, collectionUnit));
    /** retrocompatibility code for unit*/
    const appUnit = this.configService.getValue('arlas-wui.web.app.unit');
    if (appUnit || appUnits.length === 0) {
      const collectionUnit = {
        collection: this.collaborativeService.defaultCollection,
        unit: !!appUnit ? appUnit : this.collaborativeService.defaultCollection,
        ignored: false
      };
      this.appUnits.set(collectionUnit.collection, collectionUnit);
    }
    /** end of retrocompatibility code */
  }

  protected _initDisplayNames(){
    this.appUnits.forEach(collectionUnit => {
      this.getDisplayNameFromDescribe(collectionUnit.collection)
        .pipe(
          first(),
          map(displayName => {
            this.displayName.set(collectionUnit.collection, displayName);
          }),
          catchError(err => {
            return EMPTY;
          })
        ).subscribe();
    })
  }


  public getUnit(collectionName: string): string | null {
    if (this.appUnits.has(collectionName)) {
      return this.appUnits.get(collectionName).unit;
    }
    return null;
  };

  public getDisplayName(collectionName: string): string | undefined {
    return this.displayName.get(collectionName) || collectionName;
  }

  public getDisplayNameFromDescribe(collectionName: string): Observable<string> {
      return this.collaborativeService.describe(collectionName)
        .pipe(map((result: CollectionReferenceDescription) => {
          if (result.params?.display_names) {
            return result.params?.display_names?.collection
          }
          return collectionName;
        }));
  }
}
