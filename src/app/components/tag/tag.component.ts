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
import { Component, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Subject } from 'rxjs/Subject';
import { ArlasCollaborativesearchService, ArlasConfigService } from '../../services/startup/startup.service';
import { ArlasTagService } from '../../services/tag/tag.service';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { ArlasBookmarkService } from '../../services/bookmark/bookmark.service';
import { Aggregation, AggregationsRequest, AggregationResponse } from 'arlas-api';
import { from } from 'rxjs';

/**
 * This component allows to tag your selected data (documents). The tag value is set on taggable fields.
 * The list of taggable fields is available on the dialog`.
 * Note : This component is binded to ARLAS-wui configuration.
 */
@Component({
  selector: 'arlas-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TagComponent {
  /**
   * @Input : Angular
   * @description Name of the icon (Material icons)
   */
  @Input() public icon = 'local_offer';
  /**
   * @Output : Angular
   * @description A subject that emits the tag string
   */
  @Output() public tagEvent: Subject<string> = new Subject<string>();

  public dialogRef: MatDialogRef<TagDialogComponent>;
  public hoveredDiv = '';

  constructor(
    public dialog: MatDialog,
    public tagService: ArlasTagService
  ) { }

  public openDialog() {
    this.dialogRef = this.dialog.open(TagDialogComponent, { data: null });
    this.dialogRef.componentInstance.tagEvent.subscribe(value => this.tagEvent.next(value));
  }

  public removeProgress(itemId) {
    this.tagService.unfollowStatus(itemId);
  }

}

@Component({
  selector: 'arlas-tag-dialog',
  templateUrl: './tag-dialog.component.html',
  styleUrls: ['./tag-dialog.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TagDialogComponent implements OnInit {
  /**
   * @Output : Angular
   * @description A subject that emits the tag string
   */
  @Output() public tagEvent: Subject<string> = new Subject<string>();

  private server: any;
  public tagFormGroup: FormGroup;
  public taggableFields: Array<any> = [];
  public keywordFields: Array<any> = [];
  public bookmarks: Array<any> = [];
  public existingTags: Array<string> = [];

  public confirmDialogRef: MatDialogRef<ConfirmModalComponent>;

  constructor(
    private formBuilder: FormBuilder,
    public tagService: ArlasTagService,
    private configService: ArlasConfigService,
    private collaborativeSearchService: ArlasCollaborativesearchService,
    private dialog: MatDialog,
    private bookmarkService: ArlasBookmarkService,
    public dialogRef: MatDialogRef<TagDialogComponent>
  ) {
    this.server = this.configService.getValue('arlas.server');
    this.tagService.status.subscribe(status => {
      status.forEach((success, mode) => {
        if (success) {
          this.dialogRef.close();
          this.tagEvent.next(mode);
        }
      });
    });
    this.bookmarkService.bookMarkMap.forEach((v, k) => {
      this.bookmarks.push(v);
    });
  }

  public ngOnInit() {
    this.collaborativeSearchService.describe(this.server.collection.name).subscribe(
      description => {
        const fields = description.properties;
        Object.keys(fields).forEach(fieldName => {
          this.getFieldProperties(fields, fieldName);
        });
      },
      error => {
        this.collaborativeSearchService.collaborationErrorBus.next(error);
      });

    this.tagFormGroup = this.formBuilder.group({
      operationName: [''],
      fieldToTag: ['', Validators.required],
      valueOfTag: ['', Validators.required],
      propagation: [''],
      onField: [{ value: '', disabled: true }],
      linkTo: [{ value: '', disabled: true }]
    });
  }

  public fieldChange(event) {
    this.existingTags = [];
    const aggregation: Aggregation = {
      type: Aggregation.TypeEnum.Term,
      field: event.value,
      size: '10'
    };

    const aggreationRequest: AggregationsRequest = {
      aggregations: [aggregation]
    };

    from(this.collaborativeSearchService.getExploreApi().aggregatePost(this.server.collection.name, aggreationRequest))
      .subscribe((response: AggregationResponse) => {
        if (response.elements) {
          response.elements.forEach(elem => {
            this.existingTags.push(elem.key_as_string);
          });
        }
      });
  }

  /**
   * Adds a tag on a taggable field.
   * @param path Taggable field path
   * @param value Value of the tag
   */
  public addTag() {
    this.tagService.addTag(
      this.tagFormGroup.value.fieldToTag,
      this.tagFormGroup.value.valueOfTag,
      this.tagFormGroup.value.onField,
      this.tagFormGroup.value.linkTo,
      this.tagFormGroup.value.operationName
    );
  }

  /**
   * Removes a tag from a taggable field. If the tag value is not specified, all the tags of this field are removed
   * @param path Taggable field path
   * @param value Value of the tag
   */
  public removeTag() {
    if (this.tagFormGroup.value.valueOfTag) {
      this.tagService.removeTag(this.tagFormGroup.value.fieldToTag, this.tagFormGroup.value.valueOfTag);
    } else {
      this.confirmDialogRef = this.dialog.open(ConfirmModalComponent);
      this.confirmDialogRef.componentInstance.confirmHTLMMessage =
        '<strong>Remove</strong> all tags from `' + this.tagFormGroup.value.fieldToTag + '` ?';
      this.confirmDialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.tagService.removeTag(this.tagFormGroup.value.fieldToTag, null);
        }
        this.confirmDialogRef = null;
      });
    }
  }

  public propagationChange(propagate: boolean) {
    if (propagate) {
      this.tagFormGroup.setControl('onField', new FormControl('', Validators.required));
      this.tagFormGroup.setControl('linkTo', new FormControl(''));
      this.tagFormGroup.controls['onField'].enable();
      this.tagFormGroup.controls['linkTo'].enable();
    } else {
      this.tagFormGroup.setControl('onField', new FormControl(''));
      this.tagFormGroup.setControl('linkTo', new FormControl(''));
      this.tagFormGroup.controls['onField'].disable();
      this.tagFormGroup.controls['linkTo'].disable();
    }
  }

  private getFieldProperties(fieldList: any, fieldName: string, parentPrefix?: string) {
    if (fieldList[fieldName].type === 'OBJECT') {
      const subFields = fieldList[fieldName].properties;
      if (subFields) {
        Object.keys(subFields).forEach(subFieldName => {
          this.getFieldProperties(subFields, subFieldName, (parentPrefix ? parentPrefix : '') + fieldName + '.');
        });
      }
    } else {
      if (fieldList[fieldName].taggable) {
        this.taggableFields.push({ label: (parentPrefix ? parentPrefix : '') + fieldName, type: fieldList[fieldName].type });
      } else if (fieldList[fieldName].type === 'KEYWORD') {
        this.keywordFields.push({ label: (parentPrefix ? parentPrefix : '') + fieldName, type: fieldList[fieldName].type });
      }
    }
  }
}
