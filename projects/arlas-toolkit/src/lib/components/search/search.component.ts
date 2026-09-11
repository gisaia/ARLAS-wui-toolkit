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

import { AsyncPipe } from '@angular/common';
import {
  AfterViewInit, Component, computed, DestroyRef, ElementRef,
  inject, Inject, input, Input, linkedSignal, OnInit, viewChild
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { marker } from '@colsen1991/ngx-translate-extract-marker';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AggregationResponse } from 'arlas-api';
import { ArlasColorService, GetCollectionDisplayNamePipe } from 'arlas-web-components';
import { AggregationResponseWithCollection, SearchContributor } from 'arlas-web-contributors';
import { OperationEnum } from 'arlas-web-core';
import { Observable, of, Subject, zip } from 'rxjs';
import { debounceTime, filter, map, mergeMap, mergeWith, startWith } from 'rxjs/operators';
import { ArlasCollaborativesearchService } from '../../services/collaborative-search/arlas.collaborative-search.service';
import { ArlasConfigService } from '../../services/startup/startup.service';

@Component({
  selector: 'arlas-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  imports: [
    MatIconModule,
    MatButtonModule,
    TranslatePipe,
    MatTooltipModule
  ]
})
export class SearchComponent implements OnInit {
  /**
   * @Input : Angular
   * @description Search contributor
   */
  public searchContributors = input.required<SearchContributor[]>();

  /**
   * @Input : Angular
   * @description Top position of the search dialog in pixels
   */
  @Input() public dialogPositionTop = 0;

  /**
   * @Input : Angular
   * @description Left position of the search dialog in pixels
   */
  @Input() public dialogPositionLeft = 0;

  /**
   * @Input : Angular
   * @description Value of the search filter
   */
  public searchValue = input<string | undefined>();

  /** Search value displayed by the component */
  public displayedSearchValue = linkedSignal(() => this.searchValue() ?? this.searchPlaceholder());
  /**
 * @Input : Angular
 * @description Wether display or not the button to select the collections
 */
  @Input() public displayCollectionSettings = true;

  /**
   * @description Placeholder value as retrieved from the search contributor
   */
  public searchPlaceholder = computed<string>(() => this.translate.instant(
    this.searchContributors()[0] ? this.searchContributors()[0].getName() : marker('Search...')));

  public collectionsState: Map<string, boolean> = new Map();
  public collections: SearchCollection[] = [];

  private readonly destroyRef = inject(DestroyRef);
  public constructor(
    private readonly arlasColorService: ArlasColorService,
    private readonly collaborativeService: ArlasCollaborativesearchService,
    private readonly translate: TranslateService,
    private readonly dialog: MatDialog,
    private readonly configService: ArlasConfigService,
    private readonly snackbar: MatSnackBar
  ) { }

  public ngOnInit(): void {
    // By default all the collections are checked in the checkbox list
    this.searchContributors().forEach(s => this.collectionsState.set(s.collection, true));
    this.collections = this.searchContributors().map(s => ({
      label: s.collection, checked: true,
      color: this.arlasColorService.getColor(s.collection)
    }));

    // Retrieve value from the url and future collaborations
    this.searchContributors().forEach((s, i) => {
      this.collaborativeService.collaborationBus.pipe(
        filter(e => {
          const contributor = this.collaborativeService.registry.get(e.id);
          let letPassContributor = false;
          if (contributor) {
            letPassContributor = contributor.getConfigValue('type') === 'search' || contributor.getConfigValue('type') === 'chipssearch';
          }
          return s.isMyOwnCollaboration(e) || e.id === 'url' || e.id === 'all' || (letPassContributor && e.operation === OperationEnum.remove);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
        .subscribe(
          e => {
            const collaboration = this.collaborativeService.getCollaboration(s.identifier);
            if (collaboration) {
              collaboration.filters.forEach((f, collection) => {
                let initSearchValue = '';
                if (collection === s.collection) {
                  for (const filter of f) {
                    let searchtxt = filter.q?.[0][0];
                    if (searchtxt && searchtxt.split(':').length > 0) {
                      searchtxt = searchtxt.split(':')[1];
                    }
                    initSearchValue += searchtxt?.replaceAll(/"/gi, '') + ' ';
                  }
                  this.displayedSearchValue.set(initSearchValue.slice(0, -1));
                }
              });
            } else {
              this.displayedSearchValue.set(this.searchPlaceholder());
            }
          }
        );
    });
  }

  public search(value: string) {
    this.searchContributors().filter(s => this.collectionsState.get(s.collection)).forEach(s => s.search(value));
    if (this.searchContributors().length === 1) {
      this.searchContributors()[0].search(value);
    } else {
      const configDebounceTime = this.configService.getValue('arlas.server.debounceCollaborationTime');
      const debounceDuration = configDebounceTime === undefined ? 750 : configDebounceTime;
      const enabledContributors = this.searchContributors().filter(s => this.collectionsState.get(s.collection));
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
    const dialogRef = this.dialog.open<SearchDialogComponent, SearchDialogData>(SearchDialogComponent, {
      id: 'arlas-search-dialog',
      position: {
        top: this.dialogPositionTop + 'px',
        left: this.dialogPositionLeft + 'px',
      },
      data: {
        searchContributors: this.searchContributors(),
        value: this.displayedSearchValue(),
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
    this.displayedSearchValue.set(this.searchPlaceholder());
    const configDebounceTime = this.configService.getValue('arlas.server.debounceCollaborationTime');
    const debounceDuration = configDebounceTime !== undefined ? configDebounceTime : 750;
    for (let i = 0; i < this.searchContributors.length; i++) {
      setTimeout(() => {
        this.collaborativeService.removeFilter(this.searchContributors()[i].identifier);
      }, (i) * ((debounceDuration + 100) * 1.5));
    }
  }
}

/**
 * Structure describing how to represent a search collection in the options dropdown menu
 */
interface SearchCollection {
  label: string;
  checked: boolean;
  color: string;
}

/**
 * Data to give the SearchDialogComponent when opening it
 */
interface SearchDialogData {
  searchContributors: SearchContributor[];
  value: string;
  collections: SearchCollection[];
  collectionsState: Map<string, boolean>;
  displayCollectionSettings: boolean;
}

/**
 * Result of the search with autocompletion when multiple search contributors are defined
 */
interface SearchResultCollection extends AggregationResponse {
  collections: {
    color: string;
    count: number;
    collection: string;
  }[];
}

@Component({
  templateUrl: './search-dialog.component.html',
  styleUrls: ['./search-dialog.component.scss'],
  imports: [
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    ReactiveFormsModule,
    TranslatePipe,
    AsyncPipe,
    GetCollectionDisplayNamePipe,
    MatTooltipModule,
    MatCheckboxModule,
    FormsModule
  ]
})
export class SearchDialogComponent implements AfterViewInit {

  /**
   * @description Search contributor
   */
  public searchContributors: SearchContributor[];

  public onLastBackSpace: Subject<boolean> = new Subject<boolean>();

  /**
   * @description Form for the search
   */
  public searchCtrl = new FormControl('');

  /**
   * @description List of results displayed in the autocomplete
   */
  public filteredSearch: Observable<SearchResultCollection[]>;

  private readonly keyEvent = new Subject<number>();

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

  public readonly searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  public collectionsState: Map<string, boolean> = new Map();
  public collections: SearchCollection[];
  public updateAutoCompleteResult = new Subject<void>();

  public constructor(
    private readonly arlasColorService: ArlasColorService,
    private readonly collaborativeService: ArlasCollaborativesearchService,
    private readonly dialogRef: MatDialogRef<SearchDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SearchDialogData,
    private readonly translate: TranslateService
  ) {
    this.searchContributors = data.searchContributors;
    this.collectionsState = data.collectionsState;
    this.collections = data.collections;
    this.displayCollectionSettings = data.displayCollectionSettings;
    this.searchPlaceholder = this.translate.instant(this.searchContributors[0]?.getName());

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

  public ngAfterViewInit(): void {
    // Set focus after template renders
    this.searchInput()?.nativeElement.focus();
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

  public onChangeCollection(event: MatCheckboxChange) {
    if (!event.checked) {
      // Remove filter
      const contributorChanged = this.searchContributors.find(s => s.collection === event.source.id);
      if (contributorChanged && this.collaborativeService.getCollaboration(contributorChanged.identifier)) {
        this.collaborativeService.removeFilter(contributorChanged.identifier);
      }
    }
    this.collectionsState.set(event.source.id, event.checked);
    this.updateAutoCompleteResult.next();
  }

  private mergeAutoComplete(search: string): Observable<SearchResultCollection[]> {
    if (this.searchContributors.length === 1) {
      return zip(this.searchContributors.map(searchContrib => searchContrib.getAutoCompleteResponse$(search)
        .pipe(map(resp => resp.elements))))
        .pipe(map(elements => (elements as any).flat(Infinity).filter((v: AggregationResponse | undefined) => !!v)));
    } else {
      return zip(
        this.searchContributors
          .filter(searchContrib => this.collectionsState.get(searchContrib.collection))
          .map(searchContrib => zip(of(searchContrib.collection), searchContrib.getAutoCompleteResponse$(search))
            .pipe(map(f => f[1].elements?.map(e => ({ ...e, collection: f[0] } as AggregationResponseWithCollection))))
          )
      )
        .pipe(
          map(elements => (elements as any).flat(Infinity)),
          map((el: AggregationResponseWithCollection[]) => el.reduce((acc, l) => {
            if (acc.some(i => i.key_as_string === l.key_as_string)) {
              const f = acc.find(i => i.key_as_string === l.key_as_string);
              f?.collections.push({
                color: this.arlasColorService.getColor(l.collection),
                count: l.count,
                collection: l.collection
              });
            } else {
              const collections = [{
                color: this.arlasColorService.getColor(l.collection),
                count: l.count,
                collection: l.collection
              }];
              acc.push({ ...l, collections });
            }
            return acc;
          }, new Array<SearchResultCollection>()))
        );
    }
  }
}
