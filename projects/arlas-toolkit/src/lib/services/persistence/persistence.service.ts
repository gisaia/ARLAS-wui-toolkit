import { Injectable, Inject } from '@angular/core';

import { Observable } from 'rxjs/internal/Observable';
import { from } from 'rxjs/internal/observable/from';
import { Configuration, PersistApi, DataResource, DataWithLinks, Exists } from 'arlas-persistence-api';
import { ArlasSettingsService } from '../settings/arlas.settings.service';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { GET_OPTIONS } from '../../tools/utils';
import { of } from 'rxjs';


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
    return from(this.persistenceApi.create(zone, name, value, readers, writers, false, this.options)).pipe(catchError(() => /** todo*/ of()));;

  }
  public get(id: string): Observable<DataWithLinks> {
    return from(this.persistenceApi.getById(id, false, this.options));
  }

  public exists(id: string): Observable<Exists> {
    return from(this.persistenceApi.existsById(id, false, this.options));
  }

  // public getByZoneKey(zone: string, key: string): Observable<DataWithLinks> {
  //   return from(this.persistenceApi.getByKey(zone, key, false, this.options));
  // }

  // public exist(id: string): Observable<Exists> {
  //   return from(this.persistenceApi.existsById(id, false, this.options));
  // }
  // public existByZoneKey(zone: string, key: string): Observable<Exists> {
  //   return from(this.persistenceApi.existsByKey(zone, key, false, this.options));
  // }

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

  public duplicateValue(zone: string, value: string, oldName: string, newName?: string): Observable<DataWithLinks> {
    return this.create(zone, newName ? newName : 'Copy of ' + oldName, value);
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
  public updatePreview(previewId: string, readers: string[], writers: string[], newValue?: string) {
    this.exists(previewId).subscribe(
      exist => {
        if (exist.exists) {
          this.get(previewId).subscribe({
            next: (data) => {
              this.update(data.id, newValue ? newValue : data.doc_value, new Date(data.last_update_date).getTime(), data.doc_key,
                readers, writers);
            }
          });
        }
      });
  }

  public dashboardToPreviewGroups(dashboardReaders: string[], dashboardWiters: string[]): {
    readers: string[];
    writers: string[];
  } {
    let previewReaders = [];
    let previewWriters = [];
    if (dashboardReaders) {
      // Seen with AB who says normally we dont need to do the replace anymore; NOT TESTED
      previewReaders = dashboardReaders;
      // previewReaders = dashboardReaders.map(reader => reader.replace('config.json', 'preview'));
    }
    if (dashboardWiters) {
      // Seen with AB who says normally we dont need to do the replace anymore; NOT TESTED
      previewWriters = dashboardWiters;
      // previewWriters = dashboardWiters.map(writer => writer.replace('config.json', 'preview'));
    }
    return {
      readers: previewReaders,
      writers: previewWriters
    };
  }

  /** deletes the preview by its name */
  public deletePreview(previewId: string) {
    this.exists(previewId).subscribe(
      exist => {
        if (exist.exists) {
          this.delete(previewId).pipe(
            catchError(() => /** todo */ of())
          ).subscribe();
        }
      });
  }

}

export interface PersistenceSetting {
  use_local_config: any;
  url: string;
}
