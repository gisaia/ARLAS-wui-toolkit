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

import { Component, Input, Inject, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Aggregation, AggregationResponse, Filter, Expression } from 'arlas-api';
import { ChipsSearchContributor } from 'arlas-web-contributors';
import { projType, Collaboration } from 'arlas-web-core';
import { ArlasCollaborativesearchService } from '../../services/startup/startup.service';
import { Observable, Subject, Subscription, from } from 'rxjs';
import { filter, startWith, debounceTime, map, mergeMap, mergeWith } from 'rxjs/operators';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

@Component({
  selector: 'arlas-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy, OnChanges {
  /**
   * @Input : Angular
   * @description Search contributor
   */
  @Input() public searchContributor: ChipsSearchContributor;

  /**
   * @Input : Angular
   * @description Top position of the search dialog in pixels
   */
  @Input() public dialogPositionTop: number;

  /**
   * @Input : Angular
   * @description Left position of the search dialog in pixels
   */
  @Input() public dialogPositionLeft: number;

  /**
   * @Input : Angular
   * @description Value of the search filter
   */
  @Input() public searchValue: string;

  /**
   * @description Placeholder value as retrieved from the search contributor
   */
  public searchPlaceholder: string;

  public retrieveSearchValueSub: Subscription;

  public constructor(
    private collaborativeService: ArlasCollaborativesearchService,
    public translate: TranslateService,
    private dialog: MatDialog,
  ) { }

  public ngOnInit(): void {
    this.searchPlaceholder = this.translate.instant(this.searchContributor ? this.searchContributor.getName() : marker('Search...'));
    this.searchValue = this.searchPlaceholder;
    // Retrieve value from the url and future collaborations
    this.retrieveSearchValueSub = this.collaborativeService.collaborationBus.pipe(
      filter(e => this.searchContributor?.isMyOwnCollaboration(e) || e.id === 'url' || e.id === 'all')
    ).subscribe(
      e => {
        const collaboration = this.collaborativeService.getCollaboration(this.searchContributor?.identifier);
        if (collaboration) {
          collaboration.filters.forEach((f, collection) => {
            let initSearchValue = '';
            if (collection === this.searchContributor.collection) {
              for (const filter of f) {
                let searchtxt = filter.q[0][0];
                if (filter.q[0][0].split(':').length > 0) {
                  searchtxt = filter.q[0][0].split(':')[1];
                }
                const pattern = /\"/gi;
                initSearchValue += searchtxt.replace(pattern, '') + ' ';
              }
              this.searchValue = initSearchValue.slice(0, -1);
            }
          });
        } else {
          this.searchValue = this.searchPlaceholder;
        }
      }
    );
  }

  public ngOnChanges(changes: SimpleChanges): void {
    // If an empty value is passed, use the placeholder instead
    if (!!changes['searchValue'] && !changes['searchValue'].currentValue) {
      this.searchValue = this.searchPlaceholder;
    }
  }

  public ngOnDestroy(): void {
    this.retrieveSearchValueSub.unsubscribe();
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

      this.collaborativeService.setFilter(this.searchContributor?.identifier, collaboration);
    }
  }

  public openDialog() {
    const dialogRef = this.dialog.open(SearchDialogComponent, {
      id: 'arlas-search-dialog',
      position: {
        top: this.dialogPositionTop + 'px',
        left: this.dialogPositionLeft + 'px',
      },
      data: {
        searchContributor: this.searchContributor,
        value: this.searchValue
      },
      enterAnimationDuration: '0',
      exitAnimationDuration: '0'
    });

    dialogRef.afterClosed().subscribe(searchValue => {
      if (!!searchValue) {
        this.search(searchValue);
      } else if (searchValue === null || searchValue === '') {
        // When nothing is in the search and no text was typed then it is null
        // If text was typed then removed, it is ''
        this.clearSearch();
      }
    });
  }

  public clearSearch() {
    this.searchValue = this.searchPlaceholder;
    this.collaborativeService.removeFilter(this.searchContributor?.identifier);
  }
}

@Component({
  templateUrl: './search-dialog.component.html',
  styleUrls: ['./search-dialog.component.scss']
})
export class SearchDialogComponent {

  /**
   * @description Search contributor
   */
  public searchContributor: ChipsSearchContributor;

  public onLastBackSpace: Subject<boolean> = new Subject<boolean>();

  /**
   * @description Form for the search
   */
  public searchCtrl: UntypedFormControl;

  /**
   * @description List of results displayed in the autocomplete
   */
  public filteredSearch: Observable<any[]>;

  private keyEvent: Subject<number> = new Subject<number>();

  /**
   * @description Placeholder value as retrieved from the search contributor
   */
  public searchPlaceholder: string;

  /**
   * @description Indicates whether a search request has been launched
   */
  public searching = false;

  public constructor(
    public dialogRef: MatDialogRef<SearchDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { 'searchContributor': ChipsSearchContributor; 'value': string; },
    private collaborativeService: ArlasCollaborativesearchService,
    public translate: TranslateService
  ) {
    this.searchContributor = data.searchContributor;
    this.searchPlaceholder = this.translate.instant(this.searchContributor?.getName());

    if (this.searchContributor) {
      this.searchContributor.activateLastBackspace(this.onLastBackSpace);
    }

    this.searchCtrl = new UntypedFormControl();

    const autocomplete = this.searchCtrl.valueChanges.pipe(
      debounceTime(250),
      startWith(''),
      filter(search => search !== null),
      filter(search => search.length > 1),
      mergeMap(search => this.filterSearch(search)),
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
      filter(search => search === null),
      map(f => [])
    );

    // Create observable of default value autocomplete to merge it with others
    if (data.value !== this.searchPlaceholder) {
      this.searchCtrl.setValue(data.value);
      const defaultAutocomplete = this.filterSearch(data.value).pipe(map(f => f.elements));
      this.filteredSearch = noautocomplete.pipe(mergeWith(autocomplete), mergeWith(nullautocomplete), mergeWith(defaultAutocomplete));
    } else {
      this.filteredSearch = noautocomplete.pipe(mergeWith(autocomplete), mergeWith(nullautocomplete));
    }
    this.filteredSearch.subscribe((val) => {
      this.searching = false;
    });
  }

  public filterSearch(search: string): Observable<AggregationResponse> {
    if (this.searchContributor && this.searchContributor.autocomplete_field) {
      const aggregation: Aggregation = {
        type: Aggregation.TypeEnum.Term,
        field: this.searchContributor.autocomplete_field,
        include: search + '.*',
        size: (this.searchContributor.autocomplete_size).toString()
      };
      // Add filter to improve aggregation performances
      const filterAgg: Filter = {
        f: [[{
          field: this.searchContributor.autocomplete_field,
          op: Expression.OpEnum.Like,
          value: search
        }]]
      };

      this.searching = true;
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
    if (event.key === 'Enter') {
      this.dialogRef.close(this.searchCtrl.value?.trim());
    }
  }

  public clickItemSearch(event: string) {
    this.dialogRef.close(event);
  }

  public clearSearch() {
    this.searchCtrl.reset();
  }
}
