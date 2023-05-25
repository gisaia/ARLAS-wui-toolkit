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
import { animate, group, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { ArlasCollaborativesearchService } from '../../../services/startup/startup.service';
import { Filter, Expression } from 'arlas-api';
import { DataType } from 'arlas-web-components';
import * as _moment from 'moment';
import { DateTimeAdapter, OWL_DATE_TIME_LOCALE } from '@danielmoncada/angular-datetime-picker';
import { MomentDateTimeAdapter } from '@danielmoncada/angular-datetime-picker-moment-adapter';
import { HistogramContributor } from 'arlas-web-contributors';
import { TranslateService } from '@ngx-translate/core';
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
      // transition(':leave',
      //   group([
      //     animate('500ms ease-in-out')
      //   ])
      // ), // Animation duration and easing
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

  public showMore = false;
  public moreClicked = false;

  public labels: string[];
  public firstLabel: string | undefined;

  public constructor(private collaborativeSearchService: ArlasCollaborativesearchService,
    private translate: TranslateService) {

  }

  public ngOnInit(): void {
    this.collaborativeSearchService.collaborationBus.subscribe(collaborationBus => {
      const collaboration = this.collaborativeSearchService.getCollaboration(this.contributorId);
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
    });
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
        const contributor = this.collaborativeSearchService.registry.get(this.contributorId) as HistogramContributor;
        if (contributor.useUtc) {
          const end = moment.utc(+startEnd[1]).format('DD/MM/YYYY HH:mm');
          const start = moment.utc(+startEnd[0]).format('DD/MM/YYYY HH:mm');
          this.firstLabel = `${start} - ${end}`;
        } else {
          const end = moment(+startEnd[1]).format('DD/MM/YYYY HH:mm');
          const start = moment(+startEnd[0]).format('DD/MM/YYYY HH:mm');
          this.firstLabel = `${start} - ${end}`;
        }
      } else {
        let end: string | number = Math.round(+startEnd[1] * 10) / 10;
        let start: string | number  = Math.round(+startEnd[0] * 10) / 10;
        if (this.histogramUnit) {
          end = end + ' ' + this.histogramUnit;
          start = start + ' ' + this.histogramUnit;
        }
        this.firstLabel = `${start} ${this.translate.instant('to')} ${end}`;
      }
    }
  }

}
