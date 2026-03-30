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

import { Component, Inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { marker } from '@colsen1991/ngx-translate-extract-marker';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ArlasBookmarkService } from '../../services/bookmark/bookmark.service';

@Component({
  templateUrl: './bookmark-add-dialog.component.html',
  styleUrls: ['./bookmark-add-dialog.component.scss'],
  imports: [
    TranslatePipe,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatDialogModule
  ]
})
export class BookmarkAddDialogComponent {
  public bookmarkName = new FormControl('', [Validators.required]);
  public errorMessage = '';
  public disableSubmit = false;
  public constructor(
    private bookmarkService: ArlasBookmarkService,
    private translateService: TranslateService,
    public dialogRef: MatDialogRef<BookmarkAddDialogComponent>,
    @Inject(MAT_DIALOG_DATA) protected data: { name: string | undefined; }) { }

  public cancel(): void {
    this.dialogRef.close();
  }

  public submit(): void {
    this.bookmarkName.setErrors({ 'incorrect': false });
    this.disableSubmit = true;
    if (this.bookmarkName.value && !this.data.name) {
      this.bookmarkService.addBookmark(this.bookmarkName.value).subscribe({
        next: () => {
          this.dialogRef.close();
          this.bookmarkService.openSnackBar(marker('Bookmark succefully created.'));
        },
        error: e => {
          this.bookmarkName.setErrors({ 'incorrect': true });
          if (e.message === 'Required parameter id was null or undefined when calling update.') {
            this.errorMessage = this.translateService.instant('Bookmark already exists');
          } else {
            this.errorMessage = this.translateService.instant('Bookmark creation error');
          }
        },
        complete: () => this.disableSubmit = false
      });
    } else {
      this.dialogRef.close((this.bookmarkName.value));
    }
  }

  public pressEvent(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      this.submit();
    }
  }
}

