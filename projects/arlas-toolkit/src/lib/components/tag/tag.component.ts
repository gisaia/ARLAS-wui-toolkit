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
import { DatePipe, DecimalPipe, KeyValuePipe } from '@angular/common';
import { Component, ElementRef, Input, OnInit, Output, Renderer2, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, UntypedFormControl, Validators } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatOption, MatSelect, MatSelectChange } from '@angular/material/select';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable
} from '@angular/material/table';
import { TranslatePipe } from '@ngx-translate/core';
import { Aggregation, AggregationResponse, AggregationsRequest } from 'arlas-api';
import { TagRefRequest } from 'arlas-tagger-api';
import { from, Subject } from 'rxjs';
import { ArlasBookmarkService } from '../../services/bookmark/bookmark.service';
import { ArlasCollaborativesearchService } from '../../services/collaborative-search/arlas.collaborative-search.service';
import { ArlasConfigService } from '../../services/startup/startup.service';
import { ArlasTagService } from '../../services/tag/tag.service';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';

/**
 * This component allows to tag your selected data (documents). The tag value is set on taggable fields.
 * The list of taggable fields is available on the dialog`.
 * Note : This component is binded to ARLAS-wui configuration.
 */
@Component({
    selector: 'arlas-tag',
    templateUrl: './tag.component.html',
    styleUrls: ['./tag.component.scss'],
    encapsulation: ViewEncapsulation.None,
    imports: [MatIcon, MatProgressBar, DecimalPipe, KeyValuePipe, MatButtonModule]
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

  public dialogRef?: MatDialogRef<TagDialogComponent>;
  public dialogManagementRef?: MatDialogRef<TagManagementDialogComponent>;
  public hoveredDiv = '';

  public constructor(
    private readonly dialog: MatDialog,
    public tagService: ArlasTagService
  ) { }

  public openDialog() {
    this.dialogRef = this.dialog.open(TagDialogComponent, { data: null, panelClass: 'arlas-tag-dialog' });
    this.dialogRef.componentInstance.tagEvent.subscribe(value => this.tagEvent.next(value));
  }

  public openManagement() {
    this.dialogManagementRef = this.dialog.open(TagManagementDialogComponent, { data: null, panelClass: 'arlas-tag-dialog' });
  }

  public removeProgress(itemId: string) {
    this.tagService.unfollowStatus(itemId);
  }

}

@Component({
  selector: 'arlas-tag-dialog',
  templateUrl: './tag-dialog.component.html',
  styleUrls: ['./tag-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [
    FormsModule, ReactiveFormsModule, MatFormField, MatInput, MatSelect, MatOption,
    MatAutocompleteTrigger, MatAutocomplete, MatCheckbox, MatButton, MatProgressBar, TranslatePipe]
})
export class TagDialogComponent implements OnInit {
  /**
   * @Output : Angular
   * @description A subject that emits the tag string
   */
  @Output() public tagEvent: Subject<string> = new Subject<string>();

  private server: any;
  public tagFormGroup = new FormGroup({
    operationName: new FormControl(''),
    fieldToTag: new FormControl('', Validators.required),
    valueOfTag: new FormControl('', Validators.required),
    propagation: new FormControl(''),
    onField: new FormControl({ value: '', disabled: true }),
    linkTo: new FormControl({ value: '', disabled: true })
  });
  public taggableFields: Array<any> = [];
  public keywordFields: Array<any> = [];
  public bookmarks: Array<any> = [];
  public existingTags: Array<string> = [];

  public confirmDialogRef?: MatDialogRef<ConfirmModalComponent>;

  public constructor(
    public tagService: ArlasTagService,
    private readonly configService: ArlasConfigService,
    private readonly collaborativeSearchService: ArlasCollaborativesearchService,
    private readonly dialog: MatDialog,
    private readonly bookmarkService: ArlasBookmarkService,
    private readonly dialogRef: MatDialogRef<TagDialogComponent>
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
        if (fields) {
          Object.keys(fields).forEach(fieldName => {
            this.getFieldProperties(fields, fieldName);
          });
        }
      },
      error => {
        this.collaborativeSearchService.collaborationErrorBus.next(error);
      });
  }

  public fieldChange(event: MatSelectChange) {
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
      this.tagFormGroup.value.fieldToTag as string,
      this.tagFormGroup.value.valueOfTag as string,
      this.tagFormGroup.value.onField ?? undefined,
      this.tagFormGroup.value.linkTo ?? undefined,
      this.tagFormGroup.value.operationName ?? undefined
    );
  }

  /**
   * Removes a tag from a taggable field. If the tag value is not specified, all the tags of this field are removed
   * @param path Taggable field path
   * @param value Value of the tag
   */
  public removeTag() {
    if (this.tagFormGroup.value.valueOfTag) {
      this.tagService.removeTag(
        this.tagFormGroup.value.fieldToTag as string,
        this.tagFormGroup.value.valueOfTag as string,
        this.tagFormGroup.value.onField ?? undefined,
        this.tagFormGroup.value.linkTo ?? undefined
      );
    } else {
      this.confirmDialogRef = this.dialog.open(ConfirmModalComponent, { data: {
        confirmHTMLMessage: '<strong>Remove</strong> all tags from `' + this.tagFormGroup.value.fieldToTag + '` ?'
      }});

      this.confirmDialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.tagService.removeTag(this.tagFormGroup.value.fieldToTag as string);
        }
        this.confirmDialogRef = undefined;
      });
    }
  }

  public propagationChange(propagate: boolean) {
    if (propagate) {
      this.tagFormGroup.setControl('onField', new UntypedFormControl('', Validators.required));
      this.tagFormGroup.setControl('linkTo', new UntypedFormControl(''));
      this.tagFormGroup.controls['onField'].enable();
      this.tagFormGroup.controls['linkTo'].enable();
    } else {
      this.tagFormGroup.setControl('onField', new UntypedFormControl(''));
      this.tagFormGroup.setControl('linkTo', new UntypedFormControl(''));
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

@Component({
  selector: 'arlas-management-tag-dialog',
  templateUrl: './tag-management-dialog.component.html',
  styleUrls: ['./tag-management-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [
    MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatCheckbox,
    MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, MatProgressSpinner, MatButton, DatePipe, TranslatePipe]
})
export class TagManagementDialogComponent {
  public tagsRef: TagRefRequest[] = new Array<TagRefRequest>();

  public columnsToDisplay = ['checked', 'date', 'name', 'path', 'tagValue', 'propagation', 'action'];
  public isLoading = true;
  public selectedsTag: TagRefRequest[] = new Array<TagRefRequest>();

  public constructor(
    private readonly tagService: ArlasTagService,
    private readonly elem: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2,
    private readonly dialogRef: MatDialogRef<TagManagementDialogComponent>
  ) {
    this.tagService.list().subscribe(data => {
      this.isLoading = false;
      data.sort((a, b) => {
        if (!a.creation_time || !b.creation_time) {
          return 1;
        }
        return a.creation_time > b.creation_time ? 1 : -1;
      });
      this.tagsRef = data;
    });
  }

  public selectTag(event: MatCheckboxChange, index: number, tag: TagRefRequest) {
    this.elem.nativeElement.querySelectorAll('.tags-table-row').forEach((elem, i) => {
      if (index === i) {
        if (event.checked) {
          this.selectedsTag.push(tag);
          this.renderer.addClass(elem, 'active-tag');
        } else {
          this.selectedsTag.splice(this.selectedsTag.indexOf(tag), 1);
          this.renderer.removeClass(elem, 'active-tag');
        }
      }
    });
  }

  public replay() {
    this.selectedsTag.forEach((tagRef: TagRefRequest) => {
      const payload = {
        search: tagRef.search,
        tag: tagRef.tag,
        label: tagRef.label,
        propagation: tagRef.propagation
      };
      this.tagService.postTagData(payload, 'tag');
    });
    this.dialogRef.close();
  }

}
