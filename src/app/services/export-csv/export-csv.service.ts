import { Injectable, Pipe } from '@angular/core';
import { ArlasCollaborativesearchService } from '../startup/startup.service';
import { Observable, from } from 'rxjs';
import { Contributor, Collaboration, projType } from 'arlas-web-core';
import { TreeContributor, HistogramContributor } from 'arlas-web-contributors';
import { RangeRequest, RangeResponse, AggregationResponse, Aggregation } from 'arlas-api';
import { getAggregationPrecision } from 'arlas-web-contributors/utils/histoswimUtils';
import { map, flatMap } from 'rxjs/operators';
import jp from 'jsonpath/jsonpath.min';

@Injectable({
  providedIn: 'root'
})
export class ArlasExportCsvService {

  constructor(private collaborativesearchService: ArlasCollaborativesearchService) { }


  public export(contributor: Contributor, stayAtFirstLevel: boolean): Observable<Blob> {
    return this.compute(contributor).pipe(map(data => {
      const csvData = new Array<Array<string>>();
      const header = new Array<string>();
      (<TreeContributor>contributor).getAggregations().forEach(agg => {
        header.push(agg.field);
      });
      header.push('count');
      if ((<TreeContributor>contributor).getAggregations()[0].metrics) {
        (<TreeContributor>contributor).getAggregations()[0].metrics.forEach(m => {
          header.push('metric.'.concat(m.collect_field).concat('.').concat(m.collect_fct.toString()));
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
    switch (contributor.constructor.name) {
      case 'TreeContributor': {
        const aggs = (<TreeContributor>contributor).getAggregations();
        aggs.filter(agg => agg.type === Aggregation.TypeEnum.Term).map(a => a.size = '10000');
        aggResponse = this.collaborativesearchService.resolveButNotAggregation(
          [projType.aggregate, aggs], this.collaborativesearchService.collaborations);
        break;
      }
      case 'HistogramContributor': {
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
      const agg = this.collaborativesearchService.resolveButNotFieldRange([projType.range,
      <RangeRequest>{ filter: null, field: field }], collaborations, contributor.identifier)
        .pipe(
          map((rangeResponse: RangeResponse) => {
            const dataRange = (rangeResponse.min !== undefined && rangeResponse.max !== undefined) ?
              (rangeResponse.max - rangeResponse.min) : 0;
            const range = (rangeResponse.min !== undefined && rangeResponse.max !== undefined) ? rangeResponse : null;
            const aggregationPrecision = getAggregationPrecision(nbBuckets, dataRange, aggregations[0].type);
            const result = {
              range: range,
              aggregationPrecision: aggregationPrecision
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
