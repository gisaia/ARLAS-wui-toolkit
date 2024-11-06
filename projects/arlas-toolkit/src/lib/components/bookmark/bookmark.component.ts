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

import { Component, Inject, Output, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { ArlasBookmarkService } from '../../services/bookmark/bookmark.service';
import { BookMark } from '../../services/bookmark/model';
import { BookmarkPersistenceDatabase } from '../../services/bookmark/bookmarkPersistenceDatabase';
import { BookmarkDataSource } from '../../services/bookmark/bookmarkDataSource';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { BookmarkAddDialogComponent } from './bookmark-add-dialog.component';
import { ArlasCollaborativesearchService } from '../../services/startup/startup.service';

@Component({
  selector: 'arlas-bookmark',
  templateUrl: './bookmark.component.html',
  styleUrls: ['./bookmark.component.scss']
})
export class BookmarkComponent {

  public bookmarks: BookmarkDataSource | BookMark[];
  public columnsToDisplay = ['checked', 'name', 'date', 'count', 'actions'];
  public itemsCheck: Array<string> = new Array<string>();
  public disableCombine = true;
  public showCombine = true;


  public isPersistenceActive = false;
  public currentCollectionsSet = new Set<string>();

  @Output() public actions: Subject<{ action: string; id: string; geometry?: any; }> = new Subject<any>();

  public constructor(
    private bookmarkService: ArlasBookmarkService,
    private dialog: MatDialog,
    private arlasCollaborativesearchService: ArlasCollaborativesearchService,
    @Inject(MAT_DIALOG_DATA) public data: { isSelect: boolean; }
  ) {
    if (!!data && !data.isSelect) {
      // Remove the 'checked' column
      this.columnsToDisplay = ['name', 'date', 'count', 'actions'];
      this.showCombine = false;
    }

    this.currentCollectionsSet = new Set(this.arlasCollaborativesearchService.collections);
    // Init component with data from persistence server, if defined and server is reachable
    if (this.bookmarkService.dataBase instanceof BookmarkPersistenceDatabase) {
      this.isPersistenceActive = true;
      this.bookmarkService.setPage(this.bookmarkService.maxSize, this.bookmarkService.pageNumber);
      this.getBookmarksList();
      (this.bookmarkService.dataBase as BookmarkPersistenceDatabase).dataChange
        .subscribe((data: { total: number; items: BookMark[]; }) => {
          this.bookmarkService.count = data.total;
          this.bookmarks = this.getDisplayableBookmarks(data.items);
        });
    } else {
      (this.bookmarkService.dataBase).dataChange
        .subscribe((data: BookMark[]) => {
          this.bookmarkService.count = data.length;
          this.bookmarks = this.getDisplayableBookmarks(data);
        });
    }
  }

  public getDisplayableBookmarks(items: BookMark[]) {
    return items.filter(bk => {
      let allBookmarksCollectionsPresent = true;
      if (bk.collections) {
        const bookmarCollections = bk.collections.split(',');
        const absent = bookmarCollections.find(bc => !this.currentCollectionsSet.has(bc));
        allBookmarksCollectionsPresent = !absent;
        return allBookmarksCollectionsPresent;
      } else {
        return false;
      }
    });
  }

  public getBookmarksList() {
    // The subscribe is needed to consume the response to the request and create a dataChange
    this.bookmarkService.listBookmarks(this.bookmarkService.maxSize, this.bookmarkService.pageNumber).subscribe({
      error(err) {
        console.error(err);
      }
    });
  }


  public selectBookmark(event, id) {
    if (event.checked) {
      this.itemsCheck.push(id);
    } else {
      const index = this.itemsCheck.indexOf(id, 0);
      if (index > -1) {
        this.itemsCheck.splice(index, 1);
      }
    }
    if (this.itemsCheck.length < 2) {
      this.disableCombine = true;
    } else {
      const sameColor = this.itemsCheck.map(i => this.bookmarkService.bookMarkMap.get(i).color).reduce((a, b) => (a === b) ? a : 'false');
      this.disableCombine = (sameColor === 'false');
    }
  }

  public viewBookmark(id) {
    this.bookmarkService.viewBookMark(id);
    this.actions.next({ action: 'view', id: id });
  }

  public removeBookmark(id) {
    this.bookmarkService.removeBookmark(id);
    this.selectBookmark({ event: { checked: false } }, id);
    this.actions.next({ action: 'remove', id: id });
  }

  public combine() {
    const dialogRef = this.dialog.open(BookmarkAddDialogComponent, { data: { name: null } });
    dialogRef.afterClosed().subscribe(bookmarkName => {
      if (bookmarkName) {
        this.bookmarkService.createCombineBookmark(bookmarkName, new Set(this.itemsCheck));
      }
    });
  }

  public viewCombine() {
    this.bookmarkService.viewCombineBookmark(new Set(this.itemsCheck));
    this.disableCombine = true;
    this.actions.next({ action: 'view-combine', id: this.itemsCheck.join('#') });
    this.itemsCheck = new Array<string>();
  }

  public updateBookMarkName(id, name){
    const dialogRef = this.dialog.open(BookmarkAddDialogComponent, { data: { name: name } });
    dialogRef.afterClosed().subscribe(bookmarkName => {
      if (bookmarkName) {
        this.bookmarkService.updateBookmarkName(bookmarkName, id);
      }
    });
  }
}


