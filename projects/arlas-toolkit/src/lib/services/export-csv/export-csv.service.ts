/*
 * Licensed to Gisaïa under one or more contributor
 * license agreements. See the NOTICE.txt file distributed with
 * this work for additional information regarding copyright
 * ownership. Gisaïa licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Aggregation, AggregationResponse, ComputationRequest, ComputationResponse, Filter, Hits } from 'arlas-api';
import { HistogramContributor, ResultListContributor, TreeContributor } from 'arlas-web-contributors';
import { getAggregationPrecision } from 'arlas-web-contributors/utils/histoswimUtils';
import { getFieldValue } from 'arlas-web-contributors/utils/utils';
import { Collaboration, Contributor, projType } from 'arlas-web-core';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { ArlasSettingsService } from '../settings/arlas.settings.service';
import { ArlasCollaborativesearchService, ArlasConfigService } from '../startup/startup.service';

@Injectable({
  providedIn: 'root'
})
export class ArlasExportCsvService {

  public constructor(private collaborativesearchService: ArlasCollaborativesearchService, private configService: ArlasConfigService,
    private settingsService: ArlasSettingsService, private translate: TranslateService) { }

  public export(contributor: Contributor, stayAtFirstLevel: boolean, contributorType?: string): Observable<Blob> {
    return this.compute(contributor, contributorType).pipe(map(data => {
      const csvData = new Array<Array<string>>();
      const header = new Array<string>();
      (<TreeContributor>contributor).getAggregations().forEach(agg => {
        header.push(this.translate.instant(agg.field));
      });
      header.push(this.translate.instant('count'));
      if ((<TreeContributor>contributor).getAggregations()[0].metrics) {
        (<TreeContributor>contributor).getAggregations()[0].metrics.forEach(m => {
          header.push(this.translate.instant('metric.'.concat(m.collect_field).concat('.').concat(m.collect_fct.toString())));
        });
      }
      csvData.push(header);
      this.populateCSV(csvData, null, data, 0, (<TreeContributor>contributor).getAggregations(), stayAtFirstLevel);
      const CSV = csvData.map(l => l.join(';')).join('\n');
      const contentType = 'text/csv';
      const csvFile = new Blob([CSV], { type: contentType });
      return csvFile;
    }));
  }

  public compute(contributor: Contributor, contributorType?: string): Observable<AggregationResponse> {
    let aggResponse: Observable<AggregationResponse>;
    if (!contributorType) {
      contributorType = this.configService.getValue('arlas.web.contributors')
        .find(cont => cont.identifier === contributor.identifier).type;
    }
    switch (contributorType) {
      case 'tree': {
        const aggsOriginal: Aggregation[] = (<TreeContributor>contributor).getAggregations();
        const aggsForExport = [];
        aggsOriginal.forEach(agg => {
          aggsForExport.push(Object.assign({}, agg));
        });
        aggsForExport.filter(agg => agg.type === Aggregation.TypeEnum.Term).map(a => a.size = '10000');
        aggResponse = this.collaborativesearchService.resolveButNotAggregation(
          [projType.aggregate, aggsForExport], this.collaborativesearchService.collaborations, contributor.collection);
        break;
      }
      case 'histogram': {
        aggResponse = this.fetchHistogramData$(contributor);
        break;
      }
    }
    return aggResponse;
  }

  public fetchHistogramData$(contributor): Observable<AggregationResponse> {
    const collaborations = new Map<string, Collaboration>();
    this.collaborativesearchService.collaborations.forEach((k, v) => {
      collaborations.set(v, k);
    });
    const histogramExportMaxBuckets = this.settingsService.getHistogramNbBucketAtExport();
    const field = (<HistogramContributor>contributor).getField();
    const aggregations = (<HistogramContributor>contributor).getAggregations();
    const agg = this.collaborativesearchService
      .resolveButNotComputation(
        [
          projType.compute,
          <ComputationRequest>{ filter: null, field: field, metric: ComputationRequest.MetricEnum.SPANNING }
        ],
        collaborations,
        contributor.collection
      )
      .pipe(
        map((computationResponse: ComputationResponse) => {
          const dataRange = computationResponse.value || 0;
          const aggregationPrecision = getAggregationPrecision(histogramExportMaxBuckets, dataRange, aggregations[0].type);
          const result = {
            aggregationPrecision
          };
          return result;
        }),
        map((r => {
          aggregations[0].interval = r.aggregationPrecision;
          return this.collaborativesearchService.resolveButNotAggregation(
            [projType.aggregate, aggregations], collaborations, contributor.collection);
        }
        )),
        mergeMap(a => a)
      );
    return agg;
  }
  /**
   * Fetches the resulist data by taking into account the current sort/geosort, columns and details of the resultlist.
   * The number of elements fetched is configured at the applicative level with `resultlist.export_size` in settings.yaml .
   * @param contributor Resultlist contributor
   * @param filter an optional filter to add to the collaboration filters if needed
   * @returns an Observable (rxjs) of arlas Hits.
   */
  public fetchResultlistData$(contributor: ResultListContributor, filter?: Filter): Observable<Hits> {
    const size = this.settingsService.getResultlistSettings()?.export_size;
    return contributor.fetch$(size, contributor.getAllFields().map(af => af.field), filter);
  }

  /**
   * Exports hits as CSV file.
   * The columns of the CSV are retrieved from `contributor.getAllFields()` method.
   * @param contributor Resultlist contributor
   * @param hits arlas Hits to be exported as CSV
   */
  public exportResultlist(contributor: ResultListContributor, hits: Hits): void {
    const hitsList = hits.hits;
    const csvData = new Array<Array<string>>();
    const fields = contributor.getAllFields();
    csvData.push(fields.map(h => h.displayName));
    if (hitsList !== undefined && hitsList.length > 0) {
      for (let i = 0; i < hitsList.length; i++) {
        const currentLine = new Array<string>();
        const data = hitsList[i].data;
        fields.forEach(f => {
          const value = getFieldValue(f.field, data);
          currentLine.push(value !== undefined ? value : '-');
        });
        csvData.push(currentLine);
      }
    }
    const CSV = csvData.map(l => l.join(';')).join('\n');
    const contentType = 'text/csv';
    const csvFile = new Blob([CSV], { type: contentType });
    const a = document.createElement('a');
    a.download = contributor.getName()
      .concat('_')
      .concat(contributor.collection)
      .concat('_')
      .concat(new Date().getTime().toString())
      .concat('.csv');
    a.href = window.URL.createObjectURL(csvFile);
    a.dataset.downloadurl = [contentType, a.download, a.href].join(':');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  private populateCSV(csvData: Array<Array<string>>, currentLine: Array<string>,
    aggregationResponse: AggregationResponse,
    aggregationLevel: number, aggregations: Aggregation[], stayAtFirstLevel: boolean): void {
    const aggregationBuckets = aggregationResponse.elements;
    if (aggregationBuckets !== undefined && aggregationBuckets.length > 0 && aggregationResponse.name !== undefined) {
      const sumOtherDocCounts = aggregationResponse.sumotherdoccounts;
      for (let i = 0; i < aggregationBuckets.length; i++) {
        if (aggregationLevel === 0) {
          currentLine = new Array<string>();
        }
        const bucket = aggregationBuckets[i];
        const fieldValue = bucket.key;
        currentLine[aggregationLevel] = fieldValue;
        if (!stayAtFirstLevel && bucket.elements !== undefined && bucket.elements.length > 0 &&
          bucket.elements[0].elements !== undefined && bucket.elements[0].elements.length > 0) {
          this.populateCSV(csvData, currentLine, bucket.elements[0], aggregationLevel + 1, aggregations, stayAtFirstLevel);
          const l = new Array();
          for (let k = 0; k < aggregations.length; k++) {
            if (k <= aggregationLevel) {
              l.push(currentLine[k]);
            } else {
              l.push('ALL');
            }
          }
          l.push(bucket.count.toString());
          if (bucket.metrics) {
            bucket.metrics.forEach(function (m) {
              l.push(m.value);
            });
          }
          csvData.push(l);
        } else {
          const line = new Array<string>();
          currentLine.forEach(d => line.push(d));
          const diff = Math.abs((line.length - aggregations.length));
          for (let j = 1; j <= diff; j++) {
            line[aggregationLevel + j] = '';
          }
          line.push(bucket.count.toString());
          if (bucket.metrics) {
            bucket.metrics.forEach(m => {
              line.push(m.value);
            });
          }
          csvData.push(line);
        }
        if (sumOtherDocCounts > 0 && i === aggregations.length - 1) {
          const other = new Array();
          for (let k = 0; k < aggregations.length; k++) {
            if (k < aggregationLevel) {
              other.push(currentLine[k]);
            } else {
              if (k === aggregationLevel) {
                other.push('OTHER');

              } else {
                other.push('');
              }
            }
          }
          other.push(sumOtherDocCounts.toString());
          if (bucket.metrics) {
            bucket.metrics.forEach(m => other.push(''));
          }
          csvData.push(other);
        }
      }
    }
  }
}
