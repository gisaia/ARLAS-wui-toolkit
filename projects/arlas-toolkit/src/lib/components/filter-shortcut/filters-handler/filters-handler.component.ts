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
import { Component, DestroyRef, Input, OnInit, inject, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { DateTimeAdapter, OWL_DATE_TIME_LOCALE } from '@danielmoncada/angular-datetime-picker';
import { MomentDateTimeAdapter } from '@danielmoncada/angular-datetime-picker-moment-adapter';
import { TranslateService } from '@ngx-translate/core';
import { Expression } from 'arlas-api';
import { ChartType, DataType, HistogramParams, HistogramUtils } from 'arlas-d3';
import { HistogramContributor } from 'arlas-web-contributors';
import { Collaboration } from 'arlas-web-core';
import { ArlasCollaborativesearchService } from '../../../services/collaborative-search/arlas.collaborative-search.service';
import { FilterShortcutChipComponent } from '../chip/chip.component';

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
  ],
  imports: [
    MatIcon,
    FilterShortcutChipComponent,
    MatButtonModule
  ]
})
export class ShortcutFiltersHandlerComponent implements OnInit {
  /**
   * @Input : Angular
   * @description The contributor Id of the shortcut
   */
  public contributorId = input.required<string>();

  /**
   * @Input : Angular
   * @description The type of widget represented by the shortcut. can be 'powerbars' or 'histogram'.
   */
  public widgetType = input.required<string>();

  /**
   * @Input : Angular
   * @description Whether to display the value of the first filter. It will allow the user to only see the values by clicking the +X chip.
   */
  @Input() public displayFilterFirstValue = false;

  /**
   * @Input : Angular
   * @description The unit of the histogram values
   */
  @Input() public histogramUnit: string | undefined;

  /**
   * @Input : Angular
   * @description The type of data of the histogram. It can have the same values as a non-shortcut histogram.
   */
  @Input() public histogramDatatype: string | undefined;

  /**
   * @Input : Angular
   * @description The format to use for the date ticks of the shortcut's histogram
   */
  @Input() public ticksDateFormat: string | undefined;

  public histogramParams!: HistogramParams;

  public showMore = false;
  public moreClicked = false;

  public labels: string[] = [];
  private rawLabels: string[] = [];
  public firstLabel: string | undefined;

  private readonly destroyRef = inject(DestroyRef);

  public constructor(
    private readonly collaborativeSearchService: ArlasCollaborativesearchService,
    private readonly translate: TranslateService
  ) { }

  public ngOnInit(): void {
    this.setHistogramParams();
    // Check if collaboration already occured (useful when moving the shortcut from a list to another)
    const collaboration = this.collaborativeSearchService.getCollaboration(this.contributorId());
    this.checkCollaboration(collaboration);

    // Check if collaboration occurs during the lifetime of the shortcut
    this.collaborativeSearchService.collaborationBus
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(collaborationBus => {
        const collaboration = this.collaborativeSearchService.getCollaboration(this.contributorId());
        this.checkCollaboration(collaboration);
      });

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
      if (this.widgetType() === 'powerbars' || this.widgetType() === 'metricstable') {
        this.showMore = !this.displayFilterFirstValue || this.labels.length > 1;
        /** hide list when there is one label left */
        if (this.displayFilterFirstValue && this.labels.length <= 1) {
          this.moreClicked = false;
        }
      } else {
        this.showMore = !this.displayFilterFirstValue;
      }

      const collaboration = this.collaborativeSearchService.getCollaboration(this.contributorId());
      if (collaboration) {
        const filters = collaboration.filters.values().next().value;
        if (filters && filters.length > 0) {
          const filterF = filters[0].f?.[0];
          if (filterF && filterF.length > 0) {
            const expression = filterF[0];
            expression.value = this.rawLabels.join(',');
            this.collaborativeSearchService.setFilter(this.contributorId(), collaboration);
          }
        }
      }
    } else {
      this.firstLabel = undefined;
      this.labels = [];
      this.collaborativeSearchService.removeFilter(this.contributorId());
    }
  }

  private checkCollaboration(collaboration: Collaboration | undefined): void {
    this.firstLabel = undefined;
    this.labels = [];

    if (collaboration) {
      const filters = collaboration.filters.values().next().value;
      if (filters && filters.length > 0) {
        const filterF = filters[0].f?.[0];
        if (filterF && filterF.length > 0) {
          const expression = filterF[0];
          this.setLabels(expression);
        }
      }
    } else {
      this.showMore = false;
      this.moreClicked = false;
    }
  }

  private setLabels(expression: Expression) {
    this.rawLabels = expression.value.split(',');

    if (this.widgetType() === 'powerbars' || this.widgetType() === 'metricstable') {
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
    const contributor = this.collaborativeSearchService.registry.get(this.contributorId()) as HistogramContributor;

    this.histogramParams = new HistogramParams(this.contributorId());
    this.histogramParams.chartType = ChartType.bars;
    this.histogramParams.useUtc = contributor.useUtc;
    this.histogramParams.dataType = this.histogramDatatype === 'time' ? DataType.time : DataType.numeric;

    if (this.ticksDateFormat) {
      this.histogramParams.valuesDateFormat = this.ticksDateFormat;
    }
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
      const start = HistogramUtils.numberToShortValue(+startEnd[0], 2);
      const end = HistogramUtils.numberToShortValue(+startEnd[1], 2);

      label = `${start} ${this.translate.instant('to')} ${end}`;
      if (this.histogramUnit) {
        label += ' ' + this.histogramUnit;
      }
    }

    return label;
  }

}
