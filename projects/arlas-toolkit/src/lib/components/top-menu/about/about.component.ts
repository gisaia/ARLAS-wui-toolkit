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

import { Component, inject, input, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
  selector: 'arlas-about',
  template: ''
})
export class AboutComponent {

  /**
   * @Input : Angular
   * @description Path to the markdown file containing the information to display
   */
  public pathToMd = input.required<string>();

  /**
   * @Input : Angular
   * @description Extra text data displayed before the markdown
   */
  @Input() public extraTextData?: string;

  public constructor(private readonly dialog: MatDialog) { }

  public openDialog() {
    this.dialog.open<AboutDialogComponent, AboutDialogData>(AboutDialogComponent, {
      panelClass: 'arlas-about-dialog',
      data: {
        pathToMd: this.pathToMd(),
        extraTextData: this.extraTextData
      }
    });
  }
}

interface AboutDialogData {
  pathToMd: string;
  extraTextData?: string;
}

@Component({
  selector: 'arlas-about-dialog',
  templateUrl: './about-dialog.component.html',
  styleUrls: ['./about-dialog.component.scss'],
  imports: [
    MarkdownComponent
  ]
})
export class AboutDialogComponent {
  public data = inject<AboutDialogData>(MAT_DIALOG_DATA);
}

