import { Observable } from 'rxjs/Observable';
import { BookMark } from './model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DataSource } from '@angular/cdk/collections';
import { BookmarkDatabase } from './bookmarkDatabase';
import { sortOnDate } from './utils';

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
