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

import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenu } from '@angular/material/menu';
import { marker } from '@colsen1991/ngx-translate-extract-marker';
import { Subject, takeUntil } from 'rxjs';
import { ArlasBookmarkService } from '../../services/bookmark/bookmark.service';
import { ArlasCollaborativesearchService } from '../../services/collaborative-search/arlas.collaborative-search.service';
import { BookmarkAddDialogComponent } from '../bookmark/bookmark-add-dialog.component';
import { BookmarkComponent } from '../bookmark/bookmark.component';

@Component({
  selector: 'arlas-bookmark-menu',
  templateUrl: './bookmark-menu.component.html',
  styleUrls: ['./bookmark-menu.component.scss']
})
export class BookmarkMenuComponent implements OnInit, OnDestroy {

  /**
   * @Input : Angular
   * @description Icon to use for the 'Manage dataset' action
   */
  @Input() public icon: string;
  /**
   * @deprecated Top bookmarks are no longer displayed
   */
  @Input() public nbTopBookmarks: number;
  @Input() public isSelectMultipleBookmarks = true;

  public nbCollaborations = 0;
  public addBookmarkDisabled = false;
  private _onDestroy$ = new Subject<boolean>();
  public infoMessage: string;
  @ViewChild('menu') public matMenu: MatMenu;

  public constructor(
    public dialog: MatDialog,
    public bookmarkService: ArlasBookmarkService,
    private collabrativeSearchService: ArlasCollaborativesearchService  ) { }

  public ngOnInit(): void {
    this.icon = this.icon ? this.icon : 'view_list';

    this.nbCollaborations = this.collabrativeSearchService.collaborations.size;
    this.checkAddButtonState();
    this.collabrativeSearchService.collaborationBus.pipe(takeUntil(this._onDestroy$))
      .subscribe(() => {
        this.nbCollaborations = this.collabrativeSearchService.collaborations.size;
        this.checkAddButtonState();
      });
  }

  private checkAddButtonState() {
    this.addBookmarkDisabled = this.bookmarkService.count >= this.bookmarkService.maxSize
      || this.nbCollaborations === 0;
    const infoMessagesKeys = [];
    this.infoMessage = '';
    if (this.bookmarkService.count >= this.bookmarkService.maxSize) {
      infoMessagesKeys.push('maxSizeExceeded');
    }

    if (this.nbCollaborations === 0) {
      infoMessagesKeys.push('noFilter');
    }
    if (infoMessagesKeys.length > 0) {
      this.infoMessage = marker('bookmark_' + infoMessagesKeys.join('_'));
    }
  }

  public openDatasetListDialog() {
    this.dialog.open(BookmarkComponent, { width: '60vw' , maxWidth: '800px',
      data: {isSelect: this.isSelectMultipleBookmarks}, panelClass: 'bookmark-manager' });
  }

  public openDialogAdd() {
    if (!this.addBookmarkDisabled) {
      this.dialog.open(BookmarkAddDialogComponent, { data: { name: null }, id: 'add-bookmark-dialog' });
    }
  }

  public viewBookmark(id: string) {
    this.bookmarkService.viewBookMark(id);
  }

  public ngOnDestroy() {
    this._onDestroy$.next(true);
    this._onDestroy$.complete();
  }
}
