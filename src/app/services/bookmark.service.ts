import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { MatSort, MatDialogRef, MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Filter, Expression } from 'arlas-api';
import { projType, Collaboration } from 'arlas-web-core';
import { ArlasCollaborativesearchService, ArlasConfigService, ArlasStartupService } from './startup.service';

/** Constants used to fill up our data base. */
@Injectable()
export class ArlasBookmarkService {
  public dataBase: BookmarkDatabase;
  public dataSource: BookmarkDataSource | null;
  public bookMarkMap: Map<string, BookMark> = new Map<string, BookMark>();

  constructor(private collaborativesearchService: ArlasCollaborativesearchService,
    private activatedRoute: ActivatedRoute, public snackBar: MatSnackBar,
    private arlasStartupService: ArlasStartupService,
    private router: Router) {
    if (this.arlasStartupService.shouldRunApp) {
      this.dataBase = new BookmarkDatabase(this);
      this.bookMarkMap = this.dataBase.bookMarkMap;
    }
  }

  public addBookmark(newBookMarkName: string, selectedItem?: Set<string>) {
    if (selectedItem) {
      const url = this.getUrlFomSetIds(selectedItem);
      const dataModel = this.collaborativesearchService.dataModelBuilder(decodeURI(url));
      const color = '#' + this.getKeyForColor(dataModel);
      this.dataBase.addBookMark(newBookMarkName, newBookMarkName, url, BookMarkType.enumIds, color);
      this.bookMarkMap = this.dataBase.bookMarkMap;
      this.viewBookMark(url);
    } else {
      let filter = '';
      this.collaborativesearchService.collaborations.forEach((k, v) => {
        filter = filter + '-' + this.collaborativesearchService.registry.get(v).getFilterDisplayName();
      });
      const url = this.collaborativesearchService.urlBuilder().split('filter=')[1];
      const dataModel = this.collaborativesearchService.dataModelBuilder(decodeURI(url));
      const color = '#' + this.getKeyForColor(dataModel);
      let type: BookMarkType;
      if (Object.keys(dataModel).indexOf('timeline') < 0 && Object.keys(dataModel).indexOf('swimlane')) {
        type = BookMarkType.filterWithoutTime;
      } else {
        type = BookMarkType.filterWithTime;
      }
      this.dataBase.addBookMark(newBookMarkName, filter.substring(1, filter.length), url, type, color);
      this.bookMarkMap = this.dataBase.bookMarkMap;
    }
  }


  public createCombineBookmark(newBookMarkName: string, selectedBookmark: Set<string>) {
    if (this.bookMarkMap.get(Array.from(selectedBookmark)[0]).type === BookMarkType.enumIds) {
      this.addBookmark(newBookMarkName, this.combineBookmarkFromIds(selectedBookmark));
    } else {
      const dataModel = this.combineBookmarkFromFilter(selectedBookmark);
      const url = JSON.stringify(dataModel);
      const color = '#' + this.getKeyForColor(dataModel);
      let type: BookMarkType;
      if (Object.keys(dataModel).indexOf('timeline') < 0 && Object.keys(dataModel).indexOf('swimlane')) {
        type = BookMarkType.filterWithoutTime;
      } else {
        type = BookMarkType.filterWithTime;
      }
      let filter = '';
      Object.keys(dataModel).forEach(v => {
        filter = filter + '-' + this.collaborativesearchService.registry.get(v).getFilterDisplayName();
      });
      this.dataBase.addBookMark(newBookMarkName, filter.substring(1, filter.length), url, type, color);
      this.bookMarkMap = this.dataBase.bookMarkMap;


    }
  }

  public removeBookmark(id: string) {
    this.dataBase.removeBookMark(id);
    this.bookMarkMap = this.dataBase.bookMarkMap;

  }
  public viewBookMark(url: string) {
    const name = this.getBookMatkNameFromUrl(url);
    const dataModel = this.collaborativesearchService.dataModelBuilder(decodeURI(url));
    this.collaborativesearchService.setCollaborations(dataModel);
    const queryParams: Params = Object.assign({}, this.activatedRoute.snapshot.queryParams);
    queryParams['filter'] = url;
    this.router.navigate(['.'], { queryParams: queryParams });
    this.openSnackBar(name + ' loading');
  }

  public openSnackBar(message: string) {
    const config = new MatSnackBarConfig();
    config.extraClasses = ['custom-class'];
    config.duration = 750;
    config.verticalPosition = 'top';
    this.snackBar.open(message, '', config);
  }

  public setBookMarkCount(bookMark: BookMark) {
    bookMark.count = this.getCountFromUrl(bookMark.url);
  }

  public viewCombineBookmark(selectedBookmark: Set<string>) {
    if (this.bookMarkMap.get(Array.from(selectedBookmark)[0]).type === BookMarkType.enumIds) {
      const url = this.getUrlFomSetIds(this.combineBookmarkFromIds(selectedBookmark));
      this.viewBookMark(url);
    } else {
      const dataModel = this.combineBookmarkFromFilter(selectedBookmark);
      this.collaborativesearchService.setCollaborations(dataModel);
      const queryParams: Params = Object.assign({}, this.activatedRoute.snapshot.queryParams);
      queryParams['filter'] = JSON.stringify(dataModel);
      this.router.navigate(['.'], { queryParams: queryParams });
    }
  }

  private combineBookmarkFromIds(selectedBookmark: Set<string>): Set<string> {
    const ids = [];
    selectedBookmark.forEach(id => {
      const bookmark: BookMark = this.bookMarkMap.get(id);
      const dataModel = this.collaborativesearchService.dataModelBuilder(bookmark.url.replace('filter=', ''));
      dataModel['table'].filter.f[0].value.split(',').forEach(i => ids.push(i));
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
    return this.collaborativesearchService.resolveComputeHits([projType.count, {}], filters).map(hits => {
      return hits.totalnb;
    });
  }

  private getBookMatkNameFromUrl(url: string): string {
    let name = '';
    this.bookMarkMap.forEach((k, v) => {
      if (k.url === url) {
        name = k.name;
      }
    });
    return name;
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
    dataModel['table'] = collaboration;
    const url = JSON.stringify(dataModel);
    return url;

  }
  private getKeyForColor(dataModel: Object): string {
    const finalKeys: string[] = [];
    Object.keys(dataModel).forEach(k => {
      const key = [];
      if ((<Filter>dataModel[k].filter).f !== undefined) {
        (<Filter>dataModel[k].filter).f
          .forEach(e => e
            .forEach(ex => {
              if (key.indexOf('f' + ex.field + ex.op) < 0) {
                key.push('f' + ex.field + ex.op);
              }
            }));
      }
      if ((<Filter>dataModel[k].filter).q !== undefined) {
        if (key.indexOf('q') < 0) {
          key.push('q');
        }
      }
      if ((<Filter>dataModel[k].filter).gintersect !== undefined) {
        if (key.indexOf('gintersect') < 0) {
          key.push('gintersect');
        }
      }
      if ((<Filter>dataModel[k].filter).gwithin !== undefined) {
        if (key.indexOf('gwithin') < 0) {
          key.push('gwithin');
        }
      }
      if ((<Filter>dataModel[k].filter).notgintersect !== undefined) {
        if (key.indexOf('notgintersect') < 0) {
          key.push('notgintersect');
        }
      }
      if ((<Filter>dataModel[k].filter).notgwithin !== undefined) {
        if (key.indexOf('notgwithin') < 0) {
          key.push('notgwithin');
        }
      }
      if ((<Filter>dataModel[k].filter).notpwithin !== undefined) {
        if (key.indexOf('notpwithin') < 0) {
          key.push('notpwithin');
        }
      }
      if ((<Filter>dataModel[k].filter).pwithin !== undefined) {
        if (key.indexOf('pwithin') < 0) {
          key.push('pwithin');
        }
      }
      finalKeys.push(key.sort().join(','));
    });
    return this.intToRGB(this.hashCode(finalKeys.sort().join(',')));
  }
  private hashCode(str) { // java String#hashCode
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  }

  private intToRGB(i) {
    const c = (i & 0x00FFFFFF)
      .toString(16)
      .toUpperCase();
    return '00000'.substring(0, 6 - c.length) + c;
  }
}
export enum BookMarkType {
  enumIds,
  filterWithTime,
  filterWithoutTime
}

export interface BookMark {
  id: string;
  date: Date;
  name: string;
  prettyFilter: string;
  url: string;
  type: BookMarkType;
  color: string;
  count: Observable<number>;
}
export class BookmarkDatabase {
  /** Stream that emits whenever the data has been modified. */
  public dataChange: BehaviorSubject<BookMark[]> = new BehaviorSubject<BookMark[]>([]);
  get data(): BookMark[] { return this.dataChange.value; }
  public bookMarkMap: Map<string, BookMark> = new Map<string, BookMark>();
  constructor(public bookmarkService: ArlasBookmarkService) {
    if (localStorage.getItem('bookmark') !== null) {
      const copiedData = [];
      Array.from(JSON.parse(localStorage.getItem('bookmark'))).forEach((b: BookMark) => {
        copiedData.push(this.createNewBookMark(b.name, b.prettyFilter, b.url, b.type, b.color, b.id, b.date));
        this.bookMarkMap.set(b.id, this.createNewBookMark(b.name, b.prettyFilter, b.url, b.type, b.color, b.id, b.date));
      });
      const sortedData = sortOnDate(copiedData);
      this.dataChange.next(sortedData);
    }
  }

  public addBookMark(name: string, prettyFilter: string, url: string, type: BookMarkType, color: string, id?: string, date?: Date) {
    const copiedData = this.data.slice();
    const bookmark = this.createNewBookMark(name, prettyFilter, url, type, color, id, date);
    copiedData.push(bookmark);
    this.bookMarkMap.set(bookmark.id, bookmark);
    const sortedData = sortOnDate(copiedData);
    this.dataChange.next(sortedData);

  }
  public removeBookMark(id: string) {
    const copiedData = this.data.slice();
    const newData = [];
    copiedData.forEach(u => {
      if (u.id !== id) {
        newData.push(u);
      }
    });
    this.bookMarkMap.delete(id);
    this.dataChange.next(newData);
  }

  private createNewBookMark(name: string, prettyFilter: string, url: string,
    type: BookMarkType, color: string, id?: string, date?: Date): BookMark {
    let uid = '';
    let bookmarkDate: Date;
    if (id) {
      uid = id;
    } else {
      const guid = new Guid();
      uid = guid.newGuid();
    }
    if (date) {
      bookmarkDate = date;
    } else {
      bookmarkDate = new Date();
    }
    const bookMark: BookMark = {
      id: uid,
      date: new Date(),
      name: name,
      prettyFilter: prettyFilter,
      url: url,
      type: type,
      color: color,
      count: new Observable<0>()
    };
    this.bookmarkService.setBookMarkCount(bookMark);
    return bookMark;
  }
}
export class BookmarkDataSource extends DataSource<any> {
  private _filterChange = new BehaviorSubject('');
  get filter(): string { return this._filterChange.value; }
  set filter(filter: string) { this._filterChange.next(filter); }
  constructor(private _bookmarkDatabase: BookmarkDatabase) {
    super();
  }
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  public connect(): Observable<BookMark[]> {
    const displayDataChanges = [
      this._bookmarkDatabase.dataChange,
      this._filterChange


    ];
    return Observable.merge(...displayDataChanges).map(() => {
      localStorage.setItem('bookmark', JSON.stringify(this._bookmarkDatabase.data));
      return this.getSortedData();

    });
  }

  public disconnect() { }
  private getSortedData(): BookMark[] {

    const data = this._bookmarkDatabase.data.slice();
    // force date asc sort

    const sortedData = sortOnDate(data);
    return sortedData.slice().filter((item: BookMark) => {
      if (item.name !== undefined) {
        const searchStr = (item.name).toLowerCase();
        return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
      }
    });

  }
}

export class Guid {
  public newGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}
function sortOnDate(data: BookMark[]): BookMark[] {
  const sortedData = data.sort((a, b) => {
    let propertyA: number = new Date(0).getTime();
    let propertyB: number = new Date(0).getTime();
    [propertyA, propertyB] = [a.date.getTime(), b.date.getTime()];
    const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
    const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

    return (valueA < valueB ? -1 : 1) * (-1);
  });
  return sortedData;

}
