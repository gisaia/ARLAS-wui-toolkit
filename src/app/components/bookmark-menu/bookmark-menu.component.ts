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

import { Component, OnInit, Input } from '@angular/core';
import { BookMark } from '../../services/bookmark/model';
import { MatDialog } from '@angular/material';
import { ArlasBookmarkService } from '../../services/bookmark/bookmark.service';
import { BookmarkAddDialogComponent, BookmarkComponent } from '../bookmark/bookmark.component';
import { BookmarkPersistenceDatabase } from '../../services/bookmark/bookmarkPersistenceDatabase';
import { ArlasStartupService } from '../../services/startup/startup.service';


@Component({
  selector: 'arlas-bookmark-menu',
  templateUrl: './bookmark-menu.component.html',
  styleUrls: ['./bookmark-menu.component.css']
})
export class BookmarkMenuComponent implements OnInit {

  @Input() public icon: string;
  @Input() public nbTopBookmarks: number;

  public topBookmarks: Array<BookMark>;
  public isBookmarkOpen = false;
  public currentCollections = '';

  constructor(
    public dialog: MatDialog,
    private bookmarkService: ArlasBookmarkService,
    private startupService: ArlasStartupService
  ) { }

  public ngOnInit(): void {
    this.icon = this.icon ? this.icon : 'view_list';
    this.nbTopBookmarks = this.nbTopBookmarks ? this.nbTopBookmarks : 3;
    this.currentCollections = Array.from(this.startupService.collectionsMap.keys()).join(',');

    if (this.bookmarkService.dataBase instanceof BookmarkPersistenceDatabase) {
      (this.bookmarkService.dataBase as BookmarkPersistenceDatabase).dataChange
        .subscribe((bookmarks: { total: number, items: BookMark[] }) => {
          const sortedBookmark = bookmarks.items.filter(bk => {
            if (bk.collections) {
              return bk.collections === this.currentCollections;
            } else {
              return false;
            }
          }).sort((a, b) => {
            return (a.views < b.views ? -1 : 1) * (-1);
          });
          this.topBookmarks = sortedBookmark.slice(0, this.nbTopBookmarks);
        });
    } else {
      this.bookmarkService.dataBase.dataChange.subscribe(bookmarks => {
        const sortedBookmark = bookmarks.filter(bk => {
          if (bk.collections) {
            return bk.collections === this.currentCollections;
          } else {
            return false;
          }
        }).sort((a, b) => {
          return (a.views < b.views ? -1 : 1) * (-1);
        });
        this.topBookmarks = sortedBookmark.slice(0, this.nbTopBookmarks);
      });
    }
  }

  public openDialog() {
    this.dialog.open(BookmarkComponent, { width: '45vw' });
  }

  public openDialogAdd() {
    const dialogRef = this.dialog.open(BookmarkAddDialogComponent, { data: { name: null } });
    dialogRef.afterClosed().subscribe(bookmarkName => {
      if (bookmarkName) {
        this.bookmarkService.addBookmark(bookmarkName);
      }
    });
  }

  public viewBookmark(id) {
    this.bookmarkService.viewBookMark(id);
  }

}
