import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Process } from '../../tools/process.interface';
import { ArlasSettingsService } from '../settings/arlas.settings.service';
import { Expression, Search, Filter } from 'arlas-api';
import { projType } from 'arlas-web-core';
import { ArlasCollaborativesearchService } from '../startup/startup.service';

@Injectable({
  providedIn: 'root'
})
export class ProcessService {
  private processDescription: Process = {};

  public constructor(
    private http: HttpClient,
    private arlasSettingsService: ArlasSettingsService,
    private collaborativeSearchService: ArlasCollaborativesearchService
  ) { }

  /**
   *
   * @param ids List of products ids
   * @param payload Values of the dynamic form
   * @param collection Collection of selectied items
   */
  public process(ids: string[], payload: any, collection: string) {
    const requests: any[] = [];
    ids.forEach(id => {
      requests.push({ collection, item_id: id });
    });
    let data = {
      inputs: {
        requests
      }
    };
    data = Object.assign(data, payload);
    return this.http.post(this.arlasSettingsService.getProcessSettings()?.url + '/processes/download/execution', data);
  }

  public getProcessDescription(): Process {
    return this.processDescription;
  }

  public setProcessDescription(process: Process): void {
    this.processDescription = process;
  }

  public load() {
    return this.http.get(this.arlasSettingsService.getProcessSettings()?.settings.url, { responseType: 'text' })
      .pipe(
        map(c => {
          const process: Process = JSON.parse(c);
          this.setProcessDescription(process);
          return process;
        })
      );
  }

  public getItemsDetail(
    idFieldName,
    itemsId: string[],
    additionalParams: any[],
    collection: string
  ): Observable<Map<string, boolean>> {
    const search: Search = {
      page: { size: itemsId.length },
      form: { pretty: false, flat: true },
      projection: {
        includes: additionalParams.map(p => p.value.field).join(',')
      }
    };
    const expression: Expression = {
      field: idFieldName,
      // TODO: Manage other Operators ?
      op: Expression.OpEnum.Eq,
      value: itemsId.join(',')
    };
    const filterExpression: Filter = {
      f: [[expression]]
    };
    const searchResult = this.collaborativeSearchService
      .resolveHits(
        [projType.search, search],
        this.collaborativeSearchService.collaborations,
        collection,
        undefined,
        filterExpression,
        true
      );
    return searchResult.pipe(map((data: any) => {

      const matchingAdditionalParams = new Map<string, boolean>();
      if (!!data && !!data?.hits && data.hits.length > 0) {
        const regexReplacePoint = /\./gi;
        data.hits.forEach(i => {
          const itemMetadata = i.data;
          additionalParams.forEach(f => {
            const flattenField = f.value.field.replace(regexReplacePoint, '_');
            if (f.value.value === itemMetadata[flattenField]) {
              matchingAdditionalParams.set(f.name, true);
            }
          });
        });
      }
      return matchingAdditionalParams;
    }));
  }
}
