import { BehaviorSubject } from 'rxjs/BehaviorSubject';
<<<<<<< HEAD
import { BookMark, BookMarkType } from './model';
=======
import { BookMark, BookMarkType} from './model';
>>>>>>> b3374e62e3a90fe0d28ea78b0f30f65f0b4cc0a1
import { ArlasBookmarkService } from './bookmark.service';
import { sortOnDate, Guid } from './utils';
import { Observable } from 'rxjs/Observable';

export class BookmarkDatabase {
<<<<<<< HEAD
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
=======
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
>>>>>>> b3374e62e3a90fe0d28ea78b0f30f65f0b4cc0a1
