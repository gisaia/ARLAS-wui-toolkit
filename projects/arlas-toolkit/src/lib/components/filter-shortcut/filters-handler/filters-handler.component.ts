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
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ArlasCollaborativesearchService } from '../../../services/startup/startup.service';
import { Filter, Expression } from 'arlas-api';
import * as _moment from 'moment';
import { DateTimeAdapter, OWL_DATE_TIME_LOCALE } from '@danielmoncada/angular-datetime-picker';
import { MomentDateTimeAdapter } from '@danielmoncada/angular-datetime-picker-moment-adapter';
import { HistogramContributor } from 'arlas-web-contributors';
import { Collaboration } from 'arlas-web-core';
import { TranslateService } from '@ngx-translate/core';
import { HistogramUtils, HistogramParams } from 'arlas-d3';
import { ChartType, DataType } from 'arlas-web-components';
import { numberToShortString } from '../filter-shortcut.utils';
import { Subject, takeUntil } from 'rxjs';
const moment = (_moment as any).default ? (_moment as any).default : _moment;

@Component({
  selector: 'arlas-shortcut-filters-handler',
  templateUrl: './filters-handler.component.html',
  styleUrls: ['./filters-handler.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0 })), // Initial state when element is not present
      state('*', style({ opacity: 1 })), // Final state when element is present
      transition(':enter', animate('500ms ease-in-out')), // Animation duration and easing
    ])
  ],
  providers: [
    { provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE] }
  ]
})
export class ShortcutFiltersHandlerComponent implements OnInit, OnDestroy {
  /**
   * @Input : Angular
   * @description The contributor Id of the shortcut
   */
  @Input() public contributorId: string;

  /**
   * @Input : Angular
   * @description The type of widget represented by the shortcut. can be 'powerbars' or 'histogram'.
   */
  @Input() public widgetType: string;

  /**
   * @Input : Angular
   * @description Whether to display the value of the first filter. It will allow the user to only see the values by clicking the +X chip.
   */
  @Input() public displayFilterFirstValue: boolean;

  /**
   * @Input : Angular
   * @description The unit of the histogram values
   */
  @Input() public histogramUnit: string;

  /**
   * @Input : Angular
   * @description The type of data of the histogram. It can have the same values as a non-shortcut histogram.
   */
  @Input() public histogramDatatype: string;

  /**
   * @Input : Angular
   * @description The format to use for the date ticks of the shortcut's histogram
   */
  @Input() public ticksDateFormat: string;

  public histogramParams: HistogramParams = new HistogramParams();

  public showMore = false;
  public moreClicked = false;

  public labels: string[];
  public rawLabels: string[];
  public firstLabel: string | undefined;

  private _onDestroy$ = new Subject<boolean>();

  public constructor(private collaborativeSearchService: ArlasCollaborativesearchService,
    private translate: TranslateService) { }

  public ngOnInit(): void {
    // Check if collaboration already occured (useful when moving the shortcut from a list to another)
    const collaboration = this.collaborativeSearchService.getCollaboration(this.contributorId);
    this.checkCollaboration(collaboration);

    // Check if collaboration occurs during the lifetime of the shortcut
    this.collaborativeSearchService.collaborationBus
      .pipe(takeUntil(this._onDestroy$))
      .subscribe(collaborationBus => {
        const collaboration = this.collaborativeSearchService.getCollaboration(this.contributorId);
        this.checkCollaboration(collaboration);
      });

    this.setHistogramParams();
  }

  public ngOnDestroy() {
    this._onDestroy$.next(true);
    this._onDestroy$.complete();
  }

  public showFilters(clickEvent: Event) {
    clickEvent.stopPropagation();
    this.moreClicked = !this.moreClicked;
  }

  public clearFilter(label: string, idx: number) {
    this.labels = this.labels.map(l => l.replace('≠', '')).filter(l => l !== label);
    this.rawLabels.splice(idx, 1);

    if (this.labels.length > 0) {
      this.firstLabel = this.labels[0];
      if (this.widgetType === 'powerbars' || this.widgetType === 'metricstable') {
        this.showMore = !this.displayFilterFirstValue || this.labels.length > 1;
        /** hide list when there is one label left */
        if (this.displayFilterFirstValue && this.labels.length <= 1) {
          this.moreClicked = false;
        }
      } else {
        this.showMore = !this.displayFilterFirstValue;
      }

      const collaboration = this.collaborativeSearchService.getCollaboration(this.contributorId);
      if (collaboration) {
        const filters: Filter[] = collaboration.filters.values().next().value;
        if (filters && filters.length > 0) {
          const filterF: Expression[] = filters[0].f[0];
          if (filterF && filterF.length > 0) {
            const expression = filterF[0];
            expression.value = this.rawLabels.join(',');
            this.collaborativeSearchService.setFilter(this.contributorId, collaboration);
          }
        }
      }
    } else {
      this.firstLabel = undefined;
      this.labels = [];
      this.collaborativeSearchService.removeFilter(this.contributorId);
    }
  }

  private checkCollaboration(collaboration: Collaboration): void {
    this.firstLabel = undefined;
    this.labels = [];

    if (collaboration) {
      const filters: Filter[] = collaboration.filters.values().next().value;
      if (filters && filters.length > 0) {
        const filterF: Expression[] = filters[0].f[0];
        if (filterF && filterF.length > 0) {
          const expression = filterF[0];
          this.setLabels(this.widgetType, expression);
        }
      }
    } else {
      this.showMore = false;
      this.moreClicked = false;
    }
  }

  private setLabels(widgetType: string, expression: Expression) {
    this.rawLabels = expression.value.split(',');

    if (widgetType === 'powerbars' || this.widgetType === 'metricstable') {
      this.labels = expression.value.split(',');
      if (expression.op === Expression.OpEnum.Ne) {
        this.labels = this.labels.map(l => '≠' + l);
      }
      if (this.labels && this.labels.length > 0) {
        this.firstLabel = this.labels[0];
        this.showMore = !this.displayFilterFirstValue || this.labels.length > 1;
      }
    } else {
      expression.value.split(',')
        .map(interval => interval.replace('[', '').replace(']', ''))
        .forEach(interval => {
          const startEnd = interval.split('<');
          if (startEnd.length !== 2) {
            // Should never happen since ARLAS builds the intervals properly
            console.error('Interval is badly constructed: ' + startEnd);
          } else {
            this.labels.push(this.histogramSelectionToLabel(startEnd));
          }
        });

      this.showMore = !this.displayFilterFirstValue;
    }

    if (this.labels && this.labels.length > 0) {
      this.firstLabel = this.labels[0];
    }
  }

  private setHistogramParams() {
    const contributor = this.collaborativeSearchService.registry.get(this.contributorId) as HistogramContributor;

    this.histogramParams.id = this.contributorId;
    this.histogramParams.chartType = ChartType.bars;
    this.histogramParams.useUtc = contributor.useUtc;
    this.histogramParams.dataType = this.histogramDatatype === 'time' ? DataType.time : DataType.numeric;
    this.histogramParams.valuesDateFormat = this.ticksDateFormat;
  }

  private histogramSelectionToLabel(startEnd: Array<string>) {
    let label: string;
    if (this.histogramDatatype === 'time') {
      // Truncate the hours since this is a shortcut
      const start = HistogramUtils.toString(new Date(+startEnd[0]), this.histogramParams).slice(0, -6);
      const end = HistogramUtils.toString(new Date(+startEnd[1]), this.histogramParams).slice(0, -6);

      label = `${start} - ${end}`;
    } else {
      // If the number is small, truncate it to only have the first two digits
      const start = numberToShortString(+startEnd[0]);
      const end = numberToShortString(+startEnd[1]);

      label = `${start} ${this.translate.instant('to')} ${end}`;
      if (this.histogramUnit) {
        label += ' ' + this.histogramUnit;
      }
    }

    return label;
  }

}
