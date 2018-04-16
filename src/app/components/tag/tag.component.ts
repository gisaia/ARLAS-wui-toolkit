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
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ArlasTagService } from '../../services/tag/tag.service';

@Component({
  selector: 'arlas-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TagComponent {

  @Input() public icon = 'local_offer';

  constructor(
    public dialog: MatDialog
  ) { }

  public openDialog() {
    this.dialog.open(TagDialogComponent, { data: null });
  }

}

@Component({
  selector: 'arlas-tag-dialog',
  templateUrl: './tag-dialog.component.html',
  styleUrls: ['./tag-dialog.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TagDialogComponent implements OnInit {

  public tagFormGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private tagService: ArlasTagService
  ) { }

  public ngOnInit() {
    this.tagFormGroup = this.formBuilder.group({
      fieldToTag: ['', Validators.required],
    });
  }

}
