import { Injectable } from '@angular/core';
import { ArlasCollaborativesearchService, ArlasConfigService } from '../startup/startup.service';
import { Observable } from 'rxjs';
import { Contributor, Collaboration, projType } from 'arlas-web-core';
import { TreeContributor, HistogramContributor } from 'arlas-web-contributors';
import { AggregationResponse, Aggregation, ComputationRequest, ComputationResponse } from 'arlas-api';
import { getAggregationPrecision } from 'arlas-web-contributors/utils/histoswimUtils';
import { map, flatMap } from 'rxjs/operators';
import jp from 'jsonpath/jsonpath.min';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class ArlasExportCsvService {

  constructor(private collaborativesearchService: ArlasCollaborativesearchService, private configService: ArlasConfigService,
    private translate: TranslateService) { }

  public export(contributor: Contributor, stayAtFirstLevel: boolean): Observable<Blob> {
    return this.compute(contributor).pipe(map(data => {
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

  public compute(contributor: Contributor): Observable<AggregationResponse> {
    let aggResponse: Observable<AggregationResponse>;
    const contributorType = this.configService.getValue('arlas.web.contributors')
      .find(cont => cont.identifier === contributor.identifier).type;
    switch (contributorType) {
      case 'tree': {
        const aggsOriginal: Aggregation[] = (<TreeContributor>contributor).getAggregations();
        const aggsForExport = [];
        aggsOriginal.forEach(agg => {
          aggsForExport.push(Object.assign({}, agg));
        });
        aggsForExport.filter(agg => agg.type === Aggregation.TypeEnum.Term).map(a => a.size = '10000');
        aggResponse = this.collaborativesearchService.resolveButNotAggregation(
          [projType.aggregate, aggsForExport], this.collaborativesearchService.collaborations);
        break;
      }
      case 'histogram': {
        aggResponse = this.fetchHistogramData(contributor);
        break;
      }
    }
    return aggResponse;
  }

  public fetchHistogramData(contributor): Observable<AggregationResponse> {
    const collaborations = new Map<string, Collaboration>();
    this.collaborativesearchService.collaborations.forEach((k, v) => { collaborations.set(v, k); });
    const nbBuckets = (<HistogramContributor>contributor).getNbBuckets();
    const field = (<HistogramContributor>contributor).getField();
    const aggregations = (<HistogramContributor>contributor).getAggregations();
    if (nbBuckets) {
      const agg = this.collaborativesearchService.resolveButNotComputation([projType.compute,
      <ComputationRequest>{ filter: null, field: field, metric: ComputationRequest.MetricEnum.SPANNING }],
      collaborations, contributor.identifier)
        .pipe(
          map((computationResponse: ComputationResponse) => {
            const dataRange = computationResponse.value || 0;
            const aggregationPrecision = getAggregationPrecision(nbBuckets, dataRange, aggregations[0].type);
            const result = {
              aggregationPrecision
            };
            return result;
          }),
          map((r => {
            aggregations[0].interval = r.aggregationPrecision;
            return this.collaborativesearchService.resolveButNotAggregation(
              [projType.aggregate, aggregations], collaborations);
          }
          )),
          flatMap(a => a)
        );
      return agg;
    } else {
      return this.collaborativesearchService.resolveAggregation(
        [projType.aggregate, aggregations], collaborations);
    }
  }

  private populateCSV(csvData: Array<Array<string>>, currentLine: Array<string>,
    aggregationResponse: AggregationResponse,
    aggregationLevel: number, aggregations: Aggregation[], stayAtFirstLevel: boolean): void {
    if (aggregationResponse.elements !== undefined && aggregationResponse.name !== undefined) {
      const aggregationBuckets = aggregationResponse.elements;
      const sumOtherDocCounts = aggregationResponse.sumotherdoccounts;
      for (let i = 0; i < aggregationBuckets.length; i++) {
        if (aggregationLevel === 0) {
          currentLine = new Array<string>();
        }
        const bucket = aggregationBuckets[i];
        const fieldValue = bucket.key;
        currentLine[aggregationLevel] = fieldValue;
        if (!stayAtFirstLevel && bucket.elements !== undefined && bucket.elements[0].elements !== undefined) {
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
