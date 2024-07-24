import { CollectionUnit } from './utils';
import { map, Observable } from 'rxjs';
import { BaseCollectionService } from 'arlas-web-components';
import { Injectable } from '@angular/core';
import { ArlasCollaborativesearchService, ArlasConfigService } from '../services/startup/startup.service';
import { CollectionReferenceDescription } from 'arlas-api';
import { CollectionDisplayNames } from 'arlas-api/api';

@Injectable()
export class CollectionServiceImplementation extends BaseCollectionService {
  private appUnits: Map<string, CollectionUnit> = new Map();
  public constructor(private collaborativeService: ArlasCollaborativesearchService, private configService: ArlasConfigService) {
    super();
    this._setUnits();
  }

  protected _setUnits() {
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

  public getUnit(collectionName: string): string | null {
    if (this.appUnits.has(collectionName)) {
      return this.appUnits.get(collectionName).unit;
    }
    return null;
  };

  public getDisplayName(collectionName: string): Observable<CollectionDisplayNames | undefined> {
    /* could be improved with a cache if we have a lot of display name in the app
    if(!this.describeCache.has(collectionName)){
      const cache= this.collaborativeService.describe(collectionName)
        .pipe(
          shareReplay({bufferSize:1, refCount: true})
        );
      this.describeCache.set(collectionName, cache);
    } */
    return  this.collaborativeService.describe(collectionName)
      .pipe(map((result: CollectionReferenceDescription) => result.params?.display_names));
  }
}
