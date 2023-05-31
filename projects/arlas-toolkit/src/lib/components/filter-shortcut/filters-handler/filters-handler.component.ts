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
import { Component, Input, OnInit } from '@angular/core';
import { ArlasCollaborativesearchService } from '../../../services/startup/startup.service';
import { Filter, Expression } from 'arlas-api';
import * as _moment from 'moment';
import { DateTimeAdapter, OWL_DATE_TIME_LOCALE } from '@danielmoncada/angular-datetime-picker';
import { MomentDateTimeAdapter } from '@danielmoncada/angular-datetime-picker-moment-adapter';
import { HistogramContributor } from 'arlas-web-contributors';
import { Collaboration } from 'arlas-web-core';
import { TranslateService } from '@ngx-translate/core';
import { HistogramUtils, HistogramParams } from 'arlas-d3';
import { ChartType, DataType, ShortenNumberPipe } from 'arlas-web-components';
const moment = (_moment as any).default ? (_moment as any).default : _moment;

@Component({
  selector: 'arlas-shortcut-filters-handler',
  templateUrl: './filters-handler.component.html',
  styleUrls: ['./filters-handler.component.css'],
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
export class ShortcutFiltersHandlerComponent implements OnInit {
  @Input() public contributorId;
  @Input() public widgetType: string;
  @Input() public histogramUnit: string;
  @Input() public histogramDatatype: string;
  @Input() public ticksDateFormat: string;

  public histogramParams: HistogramParams = new HistogramParams();

  public showMore = false;
  public moreClicked = false;

  public labels: string[];
  public firstLabel: string | undefined;

  public constructor(private collaborativeSearchService: ArlasCollaborativesearchService,
    private translate: TranslateService,
    private shortenNumberPipe: ShortenNumberPipe) {

  }

  public ngOnInit(): void {
    // Check if collaboration already occured (useful when moving the shortcut from a list to another)
    const collaboration = this.collaborativeSearchService.getCollaboration(this.contributorId);
    this.checkCollaboration(collaboration);

    // Check if collaboration occurs during the lifetime of the shortcut
    this.collaborativeSearchService.collaborationBus.subscribe(collaborationBus => {
      const collaboration = this.collaborativeSearchService.getCollaboration(this.contributorId);
      this.checkCollaboration(collaboration);
    });

    this.setHistogramParams();
  }

  public showFilters(clickEvent: Event) {
    clickEvent.stopPropagation();
    this.moreClicked = !this.moreClicked;
  }

  public clearFilter(label: string) {
    if (this.widgetType === 'powerbars') {
      this.labels = this.labels.map(l => l.replace('≠', '')).filter(l => l !== label);
      if (this.labels.length > 0) {
        this.firstLabel = this.labels[0];
        this.showMore = this.labels.length > 1;
        /** hide list when there is one label left */
        if (this.moreClicked && this.labels.length <= 1) {
          this.moreClicked = false;
        }
        const collaboration = this.collaborativeSearchService.getCollaboration(this.contributorId);
        if (collaboration) {
          const filters: Filter[] = collaboration.filters.values().next().value;
          if (filters && filters.length > 0) {
            const filterF: Expression[] = filters[0].f[0];
            if (filterF && filterF.length > 0) {
              const expression = filterF[0];
              expression.value = this.labels.map(l => l.replace('≠', '')).join(',');
              this.collaborativeSearchService.setFilter(this.contributorId, collaboration);
            }
          }
        }
      } else {
        this.firstLabel = undefined;
        this.labels = [];
        this.collaborativeSearchService.removeFilter(this.contributorId);
      }
    } else {
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
    if (widgetType === 'powerbars') {
      this.labels = expression.value.split(',');
      if (expression.op === Expression.OpEnum.Ne) {
        this.labels = this.labels.map(l => '≠' + l);
      }
      if (this.labels && this.labels.length > 0) {
        this.firstLabel = this.labels[0];
        this.showMore = this.labels.length > 1;
      }
    } else {
      const startEnd = expression.value.replace('[', '').replace(']', '').split('<');
      if (this.histogramDatatype === 'time') {
        // Truncate the hours since this is a shortcut
        const start = HistogramUtils.toString(new Date(+startEnd[0]), this.histogramParams).slice(0, -6);
        const end = HistogramUtils.toString(new Date(+startEnd[1]), this.histogramParams).slice(0, -6);

        this.firstLabel = `${start} - ${end}`;
      } else {
        // If the number is small, truncate it to only have the first two digits
        const start = Math.abs(+startEnd[0]) < 1 ? Math.round(+startEnd[0] * 100) / 100 : this.shortenNumberPipe.transform(+startEnd[0]);
        const end = Math.abs(+startEnd[1]) < 1 ? Math.round(+startEnd[1] * 100) / 100 : this.shortenNumberPipe.transform(+startEnd[1]);

        this.firstLabel = `${start} ${this.translate.instant('to')} ${end}`;
        if (this.histogramUnit) {
          this.firstLabel += ' ' + this.histogramUnit;
        }
      }
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

}
