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
import { FormBuilder, FormGroup } from '@angular/forms';
import { Http } from '@angular/http';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Subject } from 'rxjs/Subject';
import { ArlasCollaborativesearchService, ArlasConfigService } from '../../services/startup/startup.service';
import { ArlasTagService } from '../../services/tag/tag.service';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';

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

  @Output() public addTagEvent: Subject<string> = new Subject<string>();

  private server: any;
  public tagFormGroup: FormGroup;
  public taggableFields: Array<any> = [];

  public confirmDialogRef: MatDialogRef<ConfirmModalComponent>;

  constructor(
    private formBuilder: FormBuilder,
    public tagService: ArlasTagService,
    private configService: ArlasConfigService,
    private collaborativeSearchService: ArlasCollaborativesearchService,
    private http: Http,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<TagDialogComponent>
  ) {
    this.server = this.configService.getValue('arlas.server');
    this.tagService.status.subscribe(status => {
      status.forEach((success, mode) => {
        if (success) {
          this.addTagEvent.next(mode);
          this.dialogRef.close();
        }
      });
    });
  }

  public ngOnInit() {
    this.http.get(this.server.url + '/explore/' + this.server.collection.name + '/_describe?pretty=false').map(
      response => {
        const json = response.json();
        const fields = json.properties;
        Object.keys(fields).forEach(fieldName => {
          this.getFieldProperties(fields, fieldName);
        });
      }).subscribe(
        response => { },
        error => {
          this.collaborativeSearchService.collaborationErrorBus.next(error);
        }
      );

    this.tagFormGroup = this.formBuilder.group({
      fieldToTag: [''],
      valueOfTag: ['']
    });
  }

  public addTag(path: string, value: number | string) {
    this.tagService.addTag(path, value);
  }

  public removeTag(path: string, value?: number | string) {
    if (value) {
      this.tagService.removeTag(path, value);
    } else {
      this.confirmDialogRef = this.dialog.open(ConfirmModalComponent);
      this.confirmDialogRef.componentInstance.confirmHTLMMessage = '<strong>Remove</strong> all tags from `' + path + '` ?';
      this.confirmDialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.tagService.removeTag(path, value);
        }
        this.confirmDialogRef = null;
      });
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
      }
    }
  }
}
