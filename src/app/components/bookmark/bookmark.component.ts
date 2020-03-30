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

import { Component, Output, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { ArlasBookmarkService } from '../../services/bookmark/bookmark.service';
import { ArlasDataSource } from '../../tools/arlasDataSource';
import { MatDialogRef, MatDialog, MatPaginator, PageEvent } from '@angular/material';
import { BookMark } from '../../services/bookmark/model';
import { BookmarkLocalDatabase } from '../../services/bookmark/bookmarkLocalDatabase';
import { BookmarkPersistenceDatabase } from '../../services/bookmark/bookmarkPersistenceDatabase';

@Component({
  selector: 'arlas-bookmark',
  templateUrl: './bookmark.component.html',
  styleUrls: ['./bookmark.component.css']
})
export class BookmarkComponent {

  public bookmarks: ArlasDataSource | BookMark[];
  public columnsToDisplay = ['checked', 'name', 'date', 'count', 'actions'];
  public itemsCheck: Array<string> = new Array<string>();
  public disableCombine = true;

  public resultsLength = 0;
  public pageSize = 10;
  public pageNumber = 0;

  public isPersistenceActive = false;

  @Output() public actions: Subject<{ action: string, id: string, geometry?: any }> = new Subject<any>();

  @ViewChild(MatPaginator, { static: false }) public paginator: MatPaginator;

  constructor(
    private bookmarkService: ArlasBookmarkService,
    private dialog: MatDialog
  ) {
    // Init component with data from persistence server, if defined and server is reachable
    if (this.bookmarkService.dataBase instanceof BookmarkPersistenceDatabase) {
          this.isPersistenceActive = true;
          this.bookmarkService.setPage(this.pageSize, this.pageNumber);
          this.getBookmarksList();
          (this.bookmarkService.dataBase as BookmarkPersistenceDatabase).dataChange
            .subscribe((data: { total: number, items: BookMark[] }) => {
              this.resultsLength = data.total;
              this.bookmarks = data.items;
            });
    } else {
      this.bookmarks = new ArlasDataSource(this.bookmarkService.dataBase as BookmarkLocalDatabase);
    }
  }

  public getBookmarksList() {
    this.bookmarkService.listBookmarks(this.pageSize, this.pageNumber + 1);
  }

  public pageChange(pageEvent: PageEvent) {
    this.pageNumber = pageEvent.pageIndex;
    this.pageSize = pageEvent.pageSize;
    this.bookmarkService.setPage(this.pageSize, this.pageNumber);
    this.getBookmarksList();
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
      const sameColor = this.itemsCheck.map(i => this.bookmarkService.bookMarkMap.get(i).color).reduce((a, b) => {
        return (a === b) ? a : 'false';
      });
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
}

@Component({
  templateUrl: './bookmark-add-dialog.component.html',
  styleUrls: ['./bookmark-add-dialog.component.css']
})
export class BookmarkAddDialogComponent {
  public bookmarkName: string;

  constructor(
    public dialogRef: MatDialogRef<BookmarkAddDialogComponent>) { }

  public cancel(): void {
    this.dialogRef.close();
  }

  public pressEvent(event: KeyboardEvent) {
    if (event.keyCode === 13 && this.bookmarkName) {
      this.dialogRef.close(this.bookmarkName);
    }
  }
}
