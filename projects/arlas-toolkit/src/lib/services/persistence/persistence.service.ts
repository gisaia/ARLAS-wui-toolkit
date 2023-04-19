import { Injectable, InjectionToken, Inject } from '@angular/core';

import { Observable } from 'rxjs/internal/Observable';
import { from } from 'rxjs/internal/observable/from';
import { Configuration, PersistApi, DataResource, DataWithLinks, Exists } from 'arlas-persistence-api';
import { ArlasSettingsService } from '../settings/arlas.settings.service';
import { map, mergeMap } from 'rxjs/operators';

export const GET_OPTIONS = new InjectionToken<Function>('get_options');

@Injectable({
  providedIn: 'root'
})
export class PersistenceService {

  private persistenceApi: PersistApi;
  private options;
  public isAvailable = false;
  public constructor(
    @Inject(GET_OPTIONS) private getOptions,
    private settingsService: ArlasSettingsService
  ) {
    this.setOptions(this.getOptions());
    this.createPersistenceApiInstance();
  }

  public createPersistenceApiInstance(): void {
    const persistenceSettings = this.settingsService.getPersistenceSettings();
    if (!this.persistenceApi && !!persistenceSettings) {
      const configuration = new Configuration();
      this.persistenceApi = new PersistApi(configuration, persistenceSettings.url, window.fetch);
      this.isAvailable = true;
    }
  }

  public delete(id: string): Observable<DataWithLinks> {
    return from(this.persistenceApi.deleteById(id, false, this.options));
  }

  public create(zone: string, name: string, value: string, readers?: string[], writers?: string[]): Observable<DataWithLinks> {
    return from(this.persistenceApi.create(zone, name, value, readers, writers, false, this.options));

  }
  public get(id: string): Observable<DataWithLinks> {
    return from(this.persistenceApi.getById(id, false, this.options));
  }

  public getByZoneKey(zone: string, key: string): Observable<DataWithLinks> {
    return from(this.persistenceApi.getByKey(zone, key, false, this.options));
  }

  public exist(id: string): Observable<Exists> {
    return from(this.persistenceApi.existsById(id, false, this.options));
  }
  public existByZoneKey(zone: string, key: string): Observable<Exists> {
    return from(this.persistenceApi.existsByKey(zone, key, false, this.options));
  }

  public list(zone: string, size: number, page: number, order: string): Observable<DataResource> {
    return from(this.persistenceApi.list(zone, size, page, order, false, this.options));

  }
  public update(id: string, value: string, lastUpdate: number, name?: string,
    readers?: string[], writers?: string[]): Observable<DataWithLinks> {
    return from(this.persistenceApi.update(id, value, lastUpdate, name, readers, writers, false, this.options));
  }

  public duplicate(zone: string, id: string, newName?: string): Observable<DataWithLinks> {
    return this.get(id).pipe(
      map(data => this.create(zone, newName ? newName : 'Copy of ' + data.doc_key, data.doc_value)),
      mergeMap(a => a)
    );
  }

  public rename(id: string, newName: string): Observable<DataWithLinks> {
    return this.get(id).pipe(
      map(data => this.update(id, data.doc_value, new Date(data.last_update_date).getTime(), newName, data.doc_readers, data.doc_writers)),
      mergeMap(a => a)
    );
  }

  public getGroupsByZone(zone: string) {
    return from(this.persistenceApi.getGroupsByZone(zone, false, this.options));
  }

  public setOptions(options): void {
    this.options = options;
  }

  /** updates the preview's name, readers and writers */
  public updatePreview(previewName: string, readers: string[], writers: string[]) {
    this.existByZoneKey('preview', previewName).subscribe(
      exist => {
        if (exist.exists) {
          this.getByZoneKey('preview', previewName).subscribe({
            next: (data) => {
              this.update(data.id, data.doc_value, new Date(data.last_update_date).getTime(), previewName,
                readers, writers);
            }
          });
        }
      });
  }

  /** deletes the preview by its name */
  public deletePreview(previewName: string) {
    this.existByZoneKey('preview', previewName).subscribe(
      exist => {
        if (exist.exists) {
          this.getByZoneKey('preview', previewName).subscribe({
            next: (data) => {
              this.delete(data.id);
            }
          });
        }
      });
  }

}

export interface PersistenceSetting {
  use_local_config: any;
  url: string;
}
