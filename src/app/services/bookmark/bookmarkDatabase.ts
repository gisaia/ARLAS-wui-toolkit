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

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { BookMark, BookMarkType } from './model';
import { ArlasBookmarkService } from './bookmark.service';
import { sortOnDate, Guid } from './utils';
import { Observable } from 'rxjs/Observable';

export class BookmarkDatabase {
  /** Stream that emits whenever the data has been modified. */
  public dataChange: BehaviorSubject<BookMark[]> = new BehaviorSubject<BookMark[]>([]);
  get data(): BookMark[] { return this.dataChange.value; }
  public bookMarkMap: Map<string, BookMark> = new Map<string, BookMark>();
  constructor(public bookmarkService: ArlasBookmarkService) {
    if (localStorage.getItem('bookmark') !== null) {
      const copiedData = [];
      Array.from(JSON.parse(localStorage.getItem('bookmark'))).forEach((b: BookMark) => {
        copiedData.push(this.createNewBookMark(b.name, b.prettyFilter, b.url, b.type, b.color, b.id, b.date, b.views));
        this.bookMarkMap.set(b.id, this.createNewBookMark(b.name, b.prettyFilter, b.url, b.type, b.color, b.id, b.date, b.views));
      });
      const sortedData = sortOnDate(copiedData);
      this.dataChange.next(sortedData);
    }
  }

  public createNewBookMark(name: string, prettyFilter: string, url: string,
    type: BookMarkType, color: string, id?: string, date?: Date, views?: number): BookMark {
    let uid = '';
    let bookmarkDate: Date;
    let bookmarkViews: number;
    if (id) {
      uid = id;
    } else {
      const guid = new Guid();
      uid = guid.newGuid();
    }
    if (date) {
      bookmarkDate = new Date(date);
    } else {
      bookmarkDate = new Date();
    }
    if (views) {
      bookmarkViews = views;
    } else {
      bookmarkViews = 0;
    }
    const bookMark: BookMark = {
      id: uid,
      date: bookmarkDate,
      name: name,
      prettyFilter: prettyFilter,
      url: url,
      type: type,
      color: color,
      count: new Observable<0>(),
      views: bookmarkViews
    };
    this.bookmarkService.setBookMarkCount(bookMark);
    return bookMark;
  }

  public addBookMark(bookmark: BookMark) {
    const copiedData = this.data.slice();
    copiedData.push(bookmark);
    this.bookMarkMap.set(bookmark.id, bookmark);
    const sortedData = sortOnDate(copiedData);
    localStorage.setItem('bookmark', JSON.stringify(sortedData));
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

  public incrementBookmarkView(id: string) {
    const bookmark = this.bookMarkMap.get(id);
    this.removeBookMark(id);
    bookmark.views++;
    this.addBookMark(bookmark);
  }
}
