import { Observable } from 'rxjs/Observable';
<<<<<<< HEAD
import { BookMark } from './model';
=======
import { BookMark } from "./model";
>>>>>>> b3374e62e3a90fe0d28ea78b0f30f65f0b4cc0a1
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DataSource } from '@angular/cdk/collections';
import { BookmarkDatabase } from './bookmarkDatabase';
import { sortOnDate } from './utils';

export class BookmarkDataSource extends DataSource<any> {
<<<<<<< HEAD
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
=======
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
>>>>>>> b3374e62e3a90fe0d28ea78b0f30f65f0b4cc0a1
