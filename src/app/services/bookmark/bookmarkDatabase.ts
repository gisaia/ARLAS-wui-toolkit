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
      bookmarkDate = new Date(date);
    } else {
      bookmarkDate = new Date();
    }
    const bookMark: BookMark = {
      id: uid,
      date: bookmarkDate,
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
