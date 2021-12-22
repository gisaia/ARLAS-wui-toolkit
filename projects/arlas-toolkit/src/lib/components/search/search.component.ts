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

import { ChangeDetectorRef, Component, Input, Output, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Aggregation, AggregationResponse, Filter } from 'arlas-api';
import { ChipsSearchContributor } from 'arlas-web-contributors';
import { projType, Collaboration } from 'arlas-web-core';
import { ArlasCollaborativesearchService, ArlasConfigService } from '../../services/startup/startup.service';
import { Observable, Subject, from } from 'rxjs';
import { filter, flatMap, first, merge, startWith, pairwise, debounceTime, map } from 'rxjs/operators';

@Component({
  selector: 'arlas-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  @Input() public searchContributor: ChipsSearchContributor;
  public onLastBackSpace: Subject<boolean> = new Subject<boolean>();
  public searchCtrl: FormControl;
  public filteredSearch: Observable<any[]>;
  private keyEvent: Subject<number> = new Subject<number>();

  public constructor(private collaborativeService: ArlasCollaborativesearchService,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService
  ) {


    this.searchCtrl = new FormControl();

    this.keyEvent.pipe(pairwise()).subscribe(l => {
      if (l[1] === 0 && l[0] !== 0 && this.searchContributor) {
        this.collaborativeService.removeFilter(this.searchContributor.identifier);
        this.cdr.detectChanges();
      }
    });

    this.collaborativeService.contribFilterBus.pipe(
      filter(contributor => !!contributor && this.searchContributor && contributor.identifier === this.searchContributor.identifier),
      filter(contributor => (<ChipsSearchContributor>contributor).chipMapData.size !== 0),
      first()
    ).subscribe(
      contributor => {
        let initSearchValue = '';
        (<ChipsSearchContributor>contributor).chipMapData.forEach((v, k) => {
          let searchtxt = k;
          if (k.split(':').length > 0) {
            searchtxt = k.split(':')[1];
          }
          const pattern = /\"/gi;
          initSearchValue += searchtxt.replace(pattern, '') + ' ';
        });
        this.searchCtrl.setValue(initSearchValue);
      }
    );

    if (this.searchContributor) {
      this.searchContributor.activateLastBackspace(this.onLastBackSpace);
    }

    const autocomplete = this.searchCtrl.valueChanges.pipe(
      debounceTime(250),
      startWith(''),
      filter(search => search !== null),
      filter(search => search.length > 1),
      flatMap(search => this.filterSearch(search)),
      map(f => f.elements)
    );

    const noautocomplete = this.searchCtrl.valueChanges.pipe(
      debounceTime(250),
      startWith(''),
      filter(search => search !== null),
      filter(search => search.length < 2),
      map(f => [])
    );

    const nullautocomplete = this.searchCtrl.valueChanges.pipe(
      debounceTime(250),
      startWith(''),
      filter(search => search == null),
      map(f => [])
    );

    this.filteredSearch = noautocomplete.pipe(merge(autocomplete), merge(nullautocomplete));
  }

  public filterSearch(search: string): Observable<AggregationResponse> {
    if (this.searchContributor && this.searchContributor.autocomplete_field) {
      const aggregation: Aggregation = {
        type: Aggregation.TypeEnum.Term,
        field: this.searchContributor.autocomplete_field,
        include: search + '.*',
        size: (this.searchContributor.autocomplete_size).toString()
      };
      const filterAgg: Filter = {
        q: [[this.searchContributor.autocomplete_field + ':' + search + '*']]
      };
      return this.collaborativeService.resolveButNotAggregation(
        [projType.aggregate, [aggregation]],
        this.collaborativeService.collaborations,
        this.searchContributor.collection,
        this.searchContributor.identifier,
        filterAgg
      );
    } else {
      return from([]);
    }
  }

  public onKeyUp(event: KeyboardEvent) {
    if (this.searchCtrl.value !== null) {
      this.keyEvent.next(this.searchCtrl.value.length);
    }
    if (event.keyCode === 13) {
      if (this.searchCtrl.value && this.searchCtrl.value.trim() !== '') {
        this.search(this.searchCtrl.value);
      }
    }
  }

  public clickItemSearch(event) {
    (<ElementRef>event.option._element).nativeElement.focus();
    this.search('"' + this.searchCtrl.value + '"');
  }

  public search(value: string) {
    if (value.trim() !== '' && this.searchContributor) {
      const filter: Filter = {
        q: [[this.searchContributor.search_field + ':' + value.trim()]]
      };

      const collabFilters = new Map<string, Filter[]>();
      collabFilters.set(this.searchContributor.collection, [filter]);
      const collaboration: Collaboration = {
        filters: collabFilters,
        enabled: true
      };

      this.collaborativeService.setFilter(this.searchContributor.identifier, collaboration);
    }
  }

}
