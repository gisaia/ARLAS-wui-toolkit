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

import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ArlasBookmarkService } from '../../services/bookmark/bookmark.service';
import { BookmarkAddDialogComponent, BookmarkComponent } from '../bookmark/bookmark.component';
import { ArlasStartupService } from '../../services/startup/startup.service';
import { MatMenu } from '@angular/material/menu';


@Component({
  selector: 'arlas-bookmark-menu',
  templateUrl: './bookmark-menu.component.html',
  styleUrls: ['./bookmark-menu.component.scss']
})
export class BookmarkMenuComponent implements OnInit {

  /**
   * @Input : Angular
   * @description Icon to use for the 'Manage dataset' action
   */
  @Input() public icon: string;
  /**
   * @deprecated Top bookmarks are no longer displayed
   */
  @Input() public nbTopBookmarks: number;

  @ViewChild('menu') public matMenu: MatMenu;

  public currentCollections = '';

  public constructor(
    public dialog: MatDialog,
    private bookmarkService: ArlasBookmarkService,
    private startupService: ArlasStartupService
  ) { }

  public ngOnInit(): void {
    this.icon = this.icon ? this.icon : 'view_list';
    this.currentCollections = Array.from(this.startupService.collectionsMap.keys()).sort().join(',');
  }

  public openDialog() {
    this.dialog.open(BookmarkComponent, { width: '45vw' });
  }

  public openDialogAdd() {
    const dialogRef = this.dialog.open(BookmarkAddDialogComponent, { data: { name: null } });
    dialogRef.afterClosed().subscribe(bookmarkName => {
      if (bookmarkName) {
        this.bookmarkService.addBookmark(bookmarkName).subscribe(()=>{},(e)=>console.error(e));
      }
    });
  }

  public viewBookmark(id) {
    this.bookmarkService.viewBookMark(id);
  }

}
