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

import { Component, Inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { marker } from '@colsen1991/ngx-translate-extract-marker';
import { TranslateService } from '@ngx-translate/core';
import { AggregationResponse } from 'arlas-api';
import { ArlasColorService } from 'arlas-web-components';
import { OperationEnum } from 'arlas-web-core';
import { Observable, of, Subject, Subscription, zip } from 'rxjs';
import { debounceTime, filter, map, mergeMap, mergeWith, startWith } from 'rxjs/operators';
import { ArlasCollaborativesearchService, ArlasConfigService } from '../../services/startup/startup.service';
import { SearchContributor } from 'arlas-web-contributors';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

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
  @Input() public searchContributors: SearchContributor[];

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
 * @Input : Angular
 * @description Wether display or not the button to select the collections
 */
  @Input() public displayCollectionSettings = true;

  /**
   * @description Placeholder value as retrieved from the search contributor
   */
  public searchPlaceholder: string;

  public retrieveSearchValueSubs: Subscription[];

  public collectionsState: Map<string, boolean> = new Map();
  public collections: { label: string; checked: boolean; }[];

  public constructor(
    private arlasColorService: ArlasColorService,
    private collaborativeService: ArlasCollaborativesearchService,
    public translate: TranslateService,
    private dialog: MatDialog,
    private configService: ArlasConfigService,
    private snackbar: MatSnackBar
  ) { }

  public ngOnInit(): void {
    // By default all the collections are checked in the checkbox list
    this.searchContributors.forEach(s => this.collectionsState.set(s.collection, true));
    this.collections = this.searchContributors.map(s => ({
      label: s.collection, checked: true,
      color: this.arlasColorService.getColor(s.collection)
    }));
    this.searchPlaceholder = this.translate.instant(this.searchContributors[0] ? this.searchContributors[0].getName() : marker('Search...'));
    this.searchValue = this.searchPlaceholder;
    this.retrieveSearchValueSubs = new Array(this.searchContributors.length);
    // Retrieve value from the url and future collaborations
    this.searchContributors.forEach((s, i) => {
      this.retrieveSearchValueSubs[i] = this.collaborativeService.collaborationBus.pipe(
        filter(e => {
          const contributor = this.collaborativeService.registry.get(e.id);
          let letPassContributor = false;
          if (contributor) {
            letPassContributor = contributor.getConfigValue('type') === 'search' || contributor.getConfigValue('type') === 'chipssearch';
          }
          return s.isMyOwnCollaboration(e) || e.id === 'url' || e.id === 'all' || (letPassContributor && e.operation === OperationEnum.remove);
        }))
        .subscribe(
          e => {
            const collaboration = this.collaborativeService.getCollaboration(s.identifier);
            if (collaboration) {
              collaboration.filters.forEach((f, collection) => {
                let initSearchValue = '';
                if (collection === s.collection) {
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
    });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    // If an empty value is passed, use the placeholder instead
    if (!!changes['searchValue'] && !changes['searchValue'].currentValue) {
      this.searchValue = this.searchPlaceholder;
    }
  }

  public ngOnDestroy(): void {
    this.retrieveSearchValueSubs.forEach(r => r.unsubscribe());
  }

  public search(value: string) {
    this.searchContributors.filter(s => this.collectionsState.get(s.collection)).forEach(s => s.search(value));
    if (this.searchContributors.length === 1) {
      this.searchContributors[0].search(value);
    } else {
      const configDebounceTime = this.configService.getValue('arlas.server.debounceCollaborationTime');
      const debounceDuration = configDebounceTime !== undefined ? configDebounceTime : 750;
      const enabledContributors = this.searchContributors.filter(s => this.collectionsState.get(s.collection));
      for (let i = 0; i < enabledContributors.length; i++) {
        setTimeout(() => {
          this.snackbar.open(this.translate.instant('Loading data of', { collection: enabledContributors[i].collection }));
          enabledContributors[i].search(value);
          if (i === enabledContributors.length - 1) {
            setTimeout(() => this.snackbar.dismiss(), 1000);
          }
        }, (i) * ((debounceDuration + 100) * 1.5));
      }
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
        searchContributors: this.searchContributors,
        value: this.searchValue,
        collectionsState: this.collectionsState,
        collections: this.collections,
        displayCollectionSettings: this.displayCollectionSettings
      },
      enterAnimationDuration: '0',
      exitAnimationDuration: '0'
    });

    dialogRef.afterClosed().subscribe(event => {
      if (!!event && !!event.searchValue) {
        this.collections = event.collections;
        this.collectionsState = event.collectionsState;
        this.search(event.searchValue);
      } else if (!event || event.searchValue === null || event.searchValue === '') {
        // When nothing is in the search and no text was typed then it is null
        // If text was typed then removed, it is ''
        this.clearSearch();
      }
    });
  }

  public clearSearch() {
    this.searchValue = this.searchPlaceholder;
    const configDebounceTime = this.configService.getValue('arlas.server.debounceCollaborationTime');
    const debounceDuration = configDebounceTime !== undefined ? configDebounceTime : 750;
    for (let i = 0; i < this.searchContributors.length; i++) {
      setTimeout(() => {
        this.collaborativeService.removeFilter(this.searchContributors[i].identifier);
      }, (i) * ((debounceDuration + 100) * 1.5));
    }
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
  public searchContributors: SearchContributor[];

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

  /**
 * @description Indicates whether display the collections settings button
 */
  public displayCollectionSettings = false;

  public collectionsState: Map<string, boolean> = new Map();
  public collections: { label: string; checked: boolean; color: string; }[];
  public updateAutoCompleteResult = new Subject<void>();
  public constructor(
    private arlasColorService: ArlasColorService,
    private collaborativeService: ArlasCollaborativesearchService,
    public dialogRef: MatDialogRef<SearchDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      'searchContributors': SearchContributor[];
      'value': string;
      'collections': { label: string; checked: boolean; color: string; }[];
      'collectionsState': Map<string, boolean>;
      'displayCollectionSettings': boolean;
    },
    public translate: TranslateService
  ) {
    this.searchContributors = data.searchContributors;
    this.collectionsState = data.collectionsState;
    this.collections = data.collections;
    this.displayCollectionSettings = data.displayCollectionSettings;
    this.searchPlaceholder = this.translate.instant(this.searchContributors[0]?.getName());

    this.searchCtrl = new UntypedFormControl();

    const autocomplete = this.searchCtrl.valueChanges.pipe(
      debounceTime(250),
      startWith(''),
      filter(search => search !== null),
      filter(search => search.length > 1),
      mergeMap(search => this.mergeAutoComplete(search))
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
      const defaultAutocomplete = this.mergeAutoComplete(data.value);
      this.filteredSearch = noautocomplete.pipe(mergeWith(autocomplete), mergeWith(nullautocomplete), mergeWith(defaultAutocomplete));
    } else {
      this.filteredSearch = noautocomplete.pipe(mergeWith(autocomplete), mergeWith(nullautocomplete));
    }
    this.filteredSearch.subscribe((val) => {
      this.searching = false;
    });
    this.updateAutoCompleteResult.subscribe(() => {
      if (this.searchCtrl.value && this.searchCtrl.value !== '') {
        const defaultAutocomplete = this.mergeAutoComplete(this.searchCtrl.value);
        this.filteredSearch = noautocomplete.pipe(mergeWith(autocomplete), mergeWith(nullautocomplete), mergeWith(defaultAutocomplete));
      }
    });
  }

  public onKeyUp(event: KeyboardEvent) {
    if (this.searchCtrl.value !== null) {
      this.keyEvent.next(this.searchCtrl.value.length);
    }
    if (event.key === 'Enter') {
      this.dialogRef.close(
        {
          collections: this.collections,
          collectionsState: this.collectionsState,
          searchValue: this.searchCtrl.value?.trim()
        });
    }
  }

  public clickItemSearch(keyAsString: string) {
    this.dialogRef.close({
      collections: this.collections,
      collectionsState: this.collectionsState,
      searchValue: keyAsString
    });
  }

  public clearSearch() {
    this.searchCtrl.reset();
  }
  public onChangeCollection(event) {
    if (!event.checked) {
      // Remove filter
      const contributorChanged = this.searchContributors.find(s => s.collection === event.source.id);
      if (this.collaborativeService.getCollaboration(contributorChanged.identifier)) {
        this.collaborativeService.removeFilter(contributorChanged.identifier);
      }
    }
    this.collectionsState.set(event.source.id, event.checked);
    this.updateAutoCompleteResult.next();
  }

  private mergeAutoComplete(search): Observable<AggregationResponse[]> {
    if (this.searchContributors.length === 1) {
      return zip(this.searchContributors.map(searchContrib => searchContrib.getAutoCompleteResponse$(search)
        .pipe(map(resp => resp.elements))))
        .pipe(map(elements => (elements as any).flat(Infinity)));
    } else {
      return zip(this.searchContributors.
        filter(searchContrib => this.collectionsState.get(searchContrib.collection))
        .map(searchContrib => zip(of(searchContrib.collection), searchContrib.getAutoCompleteResponse$(search))
          .pipe(map(f => f[1].elements.map(e => {
            (e as any).collection = f[0];
            return e;
          })))))
        .pipe(map(elements => (elements as any).flat(Infinity)), map((el) => el.reduce((acc, l) => {
          if (acc.find(i => i.key_as_string === l.key_as_string)) {
            const f = acc.find(i => i.key_as_string === l.key_as_string);
            f.collections.push({
              color: this.arlasColorService.getColor(l.collection),
              count: l.count,
              collection: l.collection
            });
          } else {
            l.collections = [{
              color: this.arlasColorService.getColor(l.collection),
              count: l.count,
              collection: l.collection
            }];
            acc.push({ ...l });
          }
          return acc;
        }, [])));
    }
  }
}
