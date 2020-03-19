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

import { BookMark, BookMarkType } from './model';
import { ArlasBookmarkService } from './bookmark.service';
import { Guid } from '../../tools/utils';
import { Observable } from 'rxjs';
import { ArlasLocalDatabase } from '../../tools/arlasLocalDatabase';

export class BookmarkLocalDatabase extends ArlasLocalDatabase<BookMark> {

  constructor(public bookmarkService: ArlasBookmarkService) {
    super('bookmark', bookmarkService);
  }

  public init(bookmark: BookMark, service: ArlasBookmarkService): BookMark {
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
    service.setBookMarkCount(initBookmark);
    return initBookmark;
  }

  public createBookmark(name: string, prettyFilter: string, url: string,
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

  public incrementBookmarkView(id: string) {
    const bookmark = this.storageObjectMap.get(id);
    bookmark.views++;
    super.update(id, bookmark);
  }
}
