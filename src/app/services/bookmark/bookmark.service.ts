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

import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Expression, Filter } from 'arlas-api';
import { Collaboration, projType } from 'arlas-web-core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { getKeyForColor } from '../../tools/utils';
import { PersistenceService } from '../persistence/persistence.service';
import { ArlasCollaborativesearchService, ArlasConfigService, ArlasStartupService } from '../startup/startup.service';
import { BookmarkLocalDatabase } from './bookmarkLocalDatabase';
import { BookmarkPersistenceDatabase } from './bookmarkPersistenceDatabase';
import { BookMark, BookMarkType } from './model';


/** Constants used to fill up our data base. */
@Injectable()
export class ArlasBookmarkService {
  public dataBase: BookmarkLocalDatabase | BookmarkPersistenceDatabase;
  public bookMarkMap: Map<string, BookMark> = new Map<string, BookMark>();
  public selectorById;
  public onAction = new Subject<{ action: string, id: string }>();

  constructor(private collaborativesearchService: ArlasCollaborativesearchService,
    private activatedRoute: ActivatedRoute, public snackBar: MatSnackBar,
    private arlasStartupService: ArlasStartupService,
    private configService: ArlasConfigService,
    private persistanceService: PersistenceService,
    private router: Router) {
    if (this.arlasStartupService.shouldRunApp) {
      if (!!this.configService.getConfig()['arlas']['persistence-server']
        && !!this.configService.getConfig()['arlas']['persistence-server']['url']) {
        this.dataBase = new BookmarkPersistenceDatabase(this, this.persistanceService);
        this.dataBase.dataChange.subscribe(() => {
          this.bookMarkMap = this.dataBase.storageObjectMap;
        });
      } else {
        this.dataBase = new BookmarkLocalDatabase(this);
        this.dataBase.dataChange.subscribe(() => {
          this.bookMarkMap = this.dataBase.storageObjectMap;
        });
      }
      this.selectorById = this.arlasStartupService.selectorById;
    }
  }

  /**
   * List all bookmark for the user to update dataBase
   */
  public listBookmarks(size: number, pageNumber: number) {
    (this.dataBase as BookmarkPersistenceDatabase).list(size, pageNumber, 'desc');
  }

  public setPage(size: number, pageNumber: number) {
    (this.dataBase as BookmarkPersistenceDatabase).setPage({ size: size, number: pageNumber });
  }

  public addBookmark(newBookMarkName: string, selectedItem?: Set<string>) {

    if (selectedItem) {
      const url = this.getUrlFomSetIds(selectedItem);
      const dataModel = this.collaborativesearchService.dataModelBuilder(decodeURI(url));
      const color = '#' + getKeyForColor(dataModel);
      const bookmarkFromItem = this.dataBase.createBookmark(newBookMarkName, newBookMarkName, url, BookMarkType.enumIds, color);
      this.dataBase.add(bookmarkFromItem);
      this.viewBookMark(bookmarkFromItem.id);
    } else {
      let filter = '';
      this.collaborativesearchService.collaborations.forEach((k, v) => {
        filter = filter + '-' + this.collaborativesearchService.registry.get(v).getFilterDisplayName();
      });
      const url = this.collaborativesearchService.urlBuilder().split('filter=')[1];
      const dataModel = this.collaborativesearchService.dataModelBuilder(decodeURI(url));
      const color = '#' + getKeyForColor(dataModel);
      let type: BookMarkType;
      if (!this.isTemporalFilter(dataModel)) {
        type = BookMarkType.filterWithoutTime;
      } else {
        type = BookMarkType.filterWithTime;
      }
      const bookmarkFromFilter = this.dataBase.createBookmark(newBookMarkName, filter.substring(1, filter.length), url, type, color);
      this.dataBase.add(bookmarkFromFilter);
    }
  }


  public createCombineBookmark(newBookMarkName: string, selectedBookmark: Set<string>) {
    if (this.bookMarkMap.get(Array.from(selectedBookmark)[0]).type === BookMarkType.enumIds) {
      this.addBookmark(newBookMarkName, this.combineBookmarkFromIds(selectedBookmark));
    } else {
      const dataModel = this.combineBookmarkFromFilter(selectedBookmark);
      const url = JSON.stringify(dataModel);
      const color = '#' + getKeyForColor(dataModel);
      let type: BookMarkType;
      if (!this.isTemporalFilter(dataModel)) {
        type = BookMarkType.filterWithoutTime;
      } else {
        type = BookMarkType.filterWithTime;
      }
      let filter = '';
      Object.keys(dataModel).forEach(v => {
        filter = filter + '-' + this.collaborativesearchService.registry.get(v).getFilterDisplayName();
      });
      const bookmark = this.dataBase.createBookmark(newBookMarkName, filter.substring(1, filter.length), url, type, color);
      this.dataBase.add(bookmark);
    }
  }

  public removeBookmark(id: string) {
    this.dataBase.remove(id);
    this.onAction.next({
      action: 'delete',
      id: id
    });
  }

  public viewBookMark(id: string) {
    const bookmark = this.getBookmarkById(id);
    const dataModel = this.collaborativesearchService.dataModelBuilder(decodeURI(bookmark.url));
    this.viewFromDataModel(dataModel);
    this.dataBase.incrementBookmarkView(bookmark.id);
    this.openSnackBar(bookmark.name + ' loading');
    this.onAction.next({
      action: 'view',
      id: id
    });
  }

  public openSnackBar(message: string) {
    const config = new MatSnackBarConfig();
    config.panelClass = ['custom-class'];
    config.duration = 750;
    config.verticalPosition = 'top';
    this.snackBar.open(message, '', config);
  }

  public setBookMarkCount(bookMark: BookMark) {
    bookMark.count = this.getCountFromUrl(bookMark.url);
  }

  public viewCombineBookmark(selectedBookmark: Set<string>) {
    // Increment view of each selected Bookmark
    selectedBookmark.forEach(bookmarkId => {
      this.dataBase.incrementBookmarkView(bookmarkId);
    });
    let dataModel;
    if (this.bookMarkMap.get(Array.from(selectedBookmark)[0]).type === BookMarkType.enumIds) {
      const url = this.getUrlFomSetIds(this.combineBookmarkFromIds(selectedBookmark));
      dataModel = this.collaborativesearchService.dataModelBuilder(decodeURI(url));
    } else {
      dataModel = this.combineBookmarkFromFilter(selectedBookmark);
    }
    this.viewFromDataModel(dataModel);
  }

  public init(bookmark: BookMark): BookMark {
    const initBookmark = {
      id: bookmark.id,
      date: new Date(bookmark.date),
      name: bookmark.name,
      prettyFilter: bookmark.prettyFilter,
      url: bookmark.url,
      type: bookmark.type,
      color: bookmark.color,
      count: new Observable<0>(),
      views: bookmark.views
    };
    this.setBookMarkCount(initBookmark);
    return initBookmark;
  }

  private viewFromDataModel(dataModel: Object) {
    this.collaborativesearchService.setCollaborations(dataModel);
    let language = null;
    if (this.activatedRoute.snapshot.queryParams['lg']) {
      language = this.activatedRoute.snapshot.queryParams['lg'];
    }
    const queryParams: Params = Object.assign({}, this.activatedRoute.snapshot.queryParams);
    queryParams['filter'] = JSON.stringify(dataModel);
    if (language) {
      queryParams['lg'] = language;
    }
    this.router.navigate(['.'], { queryParams: queryParams });
  }

  private combineBookmarkFromIds(selectedBookmark: Set<string>): Set<string> {
    const ids = [];
    selectedBookmark.forEach(id => {
      const bookmark: BookMark = this.bookMarkMap.get(id);
      const dataModel = this.collaborativesearchService.dataModelBuilder(bookmark.url.replace('filter=', ''));
      dataModel[this.selectorById].filter.f[0][0].value.split(',').forEach(i => ids.push(i));
    });
    return new Set(ids);
  }


  private combineBookmarkFromFilter(selectedBookmark: Set<string>): Object {
    const dataModel = {};
    selectedBookmark.forEach(id => {
      const bookmark: BookMark = this.bookMarkMap.get(id);
      const bookMarkDataModel = this.collaborativesearchService.dataModelBuilder(bookmark.url.replace('filter=', ''));
      if (Object.keys(dataModel).length === 0) {
        Object.keys(bookMarkDataModel).forEach(k => {
          dataModel[k] = bookMarkDataModel[k];
        });
      } else {
        Object.keys(bookMarkDataModel).forEach(k => {
          if (dataModel[k] === undefined) {
            dataModel[k] = bookMarkDataModel[k];
          } else {
            Object.keys(bookMarkDataModel[k].filter)
              .forEach(keyfil => {
                if (dataModel[k].filter[keyfil] === undefined) {
                  dataModel[k].filter[keyfil] = bookMarkDataModel[k].filter[keyfil];
                } else {
                  bookMarkDataModel[k].filter[keyfil]
                    .forEach(ex => ex
                      .forEach(e =>
                        dataModel[k].filter[keyfil][0].push(e)
                      )
                    );
                }
              });
          }
        });
      }
    });
    return dataModel;
  }

  private getCountFromUrl(url: string): Observable<number> {
    const dataModel = this.collaborativesearchService.dataModelBuilder(url);
    const filters: Array<Filter> = [];
    Object.keys(dataModel).forEach(key => {
      filters.push(dataModel[key].filter);
    });
    return this.collaborativesearchService.resolveComputeHits([projType.count, {}], filters).pipe(map(hits => {
      return hits.totalnb;
    }));
  }

  private getBookmarkById(id: string): BookMark {
    let bookmark: BookMark;
    this.bookMarkMap.forEach((k, v) => {
      if (k.id === id) {
        bookmark = k;
      }
    });
    return bookmark;
  }

  private getUrlFomSetIds(selectedItem?: Set<string>): string {
    const dataModel = {};
    const collaboration: Collaboration = {
      filter: {},
      enabled: true,
    };
    const f: Array<Expression> = [];
    let values = '';
    selectedItem.forEach(s => {
      values = values + s + ',';

    });
    const e: Expression = {
      field: this.arlasStartupService.collectionId,
      op: Expression.OpEnum.Eq,
      value: values.substring(0, values.length - 1)
    };
    f.push(e);
    const filters: Filter = {
      f: [f]
    };
    collaboration.filter = filters;
    dataModel[this.selectorById] = collaboration;
    const url = JSON.stringify(dataModel);
    return url;

  }

  private isTemporalFilter(dataModel: Object): boolean {
    let isTemporalFilter = false;
    Object.keys(dataModel).forEach(key => {
      if (this.arlasStartupService.temporalContributor.indexOf(key) >= 0) {
        isTemporalFilter = true;
      }
    });
    return isTemporalFilter;
  }

}
