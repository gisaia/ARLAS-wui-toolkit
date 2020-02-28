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
import { MatDialog } from '@angular/material';
import { ArlasCollaborativesearchService, ArlasConfigService } from '../../services/startup/startup.service';
import { ArlasSearchField } from '../share/model/ArlasSearchField';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { projType } from 'arlas-web-core';
import { Filter } from 'arlas-api';

@Component({
  selector: 'arlas-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.css']
})
export class DownloadComponent {

  @Input() public icon = 'get_app';

  constructor(
    public dialog: MatDialog
  ) { }

  public openDialog() {
    this.dialog.open(DownloadDialogComponent, { data: null });
  }

}

@Component({
  selector: 'arlas-download-dialog',
  templateUrl: './download-dialog.component.html',
  styleUrls: ['./download-dialog.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DownloadDialogComponent implements OnInit {

  public allFields = new Array<ArlasSearchField>();
  public selectedFields = new Array<ArlasSearchField>();
  public selectedSortableFields = new Array<ArlasSearchField>();
  public selectedFieldString = '';
  public selectedFirstOrderField: ArlasSearchField;
  public selectedSecondOrderField: ArlasSearchField;
  public selectedThirdOrderField: ArlasSearchField;

  public firstOrderColunm: number;
  public secondOrderColunm: number;
  public thirdOrderColunm: number;
  public orderCommand: string;
  public filterUrl: string;
  public exportedTypeCommand: string;

  public isCopied = false;

  public server: any;

  public exportTypeGroup: FormGroup;
  public paramFormGroup: FormGroup;

  private GEO_TYPE_PREFIX = 'GEO_';

  constructor(
    private formBuilder: FormBuilder,
    private collaborativeService: ArlasCollaborativesearchService,
    private configService: ArlasConfigService
  ) { }

  public ngOnInit() {
    this.exportTypeGroup = this.formBuilder.group({
      exportType: ['', Validators.required]
    });
    this.paramFormGroup = this.formBuilder.group({
      availableFields: ['', Validators.required],
      orderField: [''],
      orderField2: [{ value: '', disabled: true }],
      orderField3: [{ value: '', disabled: true }]
    });

    this.server = this.configService.getValue('arlas.server');
    this.collaborativeService.describe(this.server.collection.name).subscribe(
      description => {
        const fields = description.properties;
        Object.keys(fields).forEach(fieldName => {
          this.getFieldProperties(fields, fieldName);
        });
      },
      error => {
        this.collaborativeService.collaborationErrorBus.next(error);
      });
  }

  public onSelectionChange(selectedOptionsList) {
    this.selectedFields = new Array<ArlasSearchField>();
    this.selectedFieldString = '';
    selectedOptionsList.forEach((option, index) => {
      const field = option._element.nativeElement.textContent.split('-');
      this.selectedFields.push(new ArlasSearchField(field[0].trim(), field[1].trim()));
      this.selectedFieldString += (index !== 0 ? ',' : '') + field[0].trim();
    });
    this.selectedSortableFields = this.selectedFields.filter(sf => !sf.type.startsWith(this.GEO_TYPE_PREFIX));
    this.selectedFirstOrderField = null;
    this.selectedSecondOrderField = null;
    this.selectedThirdOrderField = null;
  }

  public orderSelect() {
    if (this.selectedFirstOrderField) {
      this.paramFormGroup.get('orderField2').enable();
    } else {
      this.paramFormGroup.get('orderField2').disable();
      this.selectedSecondOrderField = null;
    }

    if (this.selectedSecondOrderField) {
      this.paramFormGroup.get('orderField3').enable();
    } else {
      this.paramFormGroup.get('orderField3').disable();
      this.selectedThirdOrderField = null;
    }
  }

  /**
   * Switches between dialog steps
   * @param event The step index
   */
  public changeStep(event) {
    if (event.selectedIndex === 2) {
      this.isCopied = false;
      this.exportedTypeCommand = this.exportTypeGroup.get('exportType').value;
      this.orderCommand = '';
      const filters = Array.from(this.collaborativeService.collaborations.values()).map(element => element.filter);
      this.filterUrl = this.collaborativeService.getUrl([projType.search, []], filters);
      if (this.exportTypeGroup.get('exportType').value === 'csv'
        && (this.selectedFirstOrderField || this.selectedSecondOrderField || this.selectedThirdOrderField)) {
        this.exportedTypeCommand = this.exportedTypeCommand + ' \\';
        this.firstOrderColunm = 1;
        this.secondOrderColunm = 2;
        this.thirdOrderColunm = 3;
        this.selectedSortableFields.forEach((field, index) => {
          if (this.selectedFirstOrderField && field.label === this.selectedFirstOrderField.label) {
            this.firstOrderColunm = index + 1;
          }
          if (this.selectedSecondOrderField && field.label === this.selectedSecondOrderField.label) {
            this.secondOrderColunm = index + 1;
          }
          if (this.selectedThirdOrderField && field.label === this.selectedThirdOrderField.label) {
            this.thirdOrderColunm = index + 1;
          }
        });
        this.orderCommand = '--sort_csv=' + (this.selectedFirstOrderField ? '-k' + this.firstOrderColunm + ' ' : '')
          + (this.selectedSecondOrderField ? '-k' + this.secondOrderColunm + ' ' : '')
          + (this.selectedThirdOrderField ? '-k' + this.thirdOrderColunm : '');
      }
    }
  }

  /**
   * Copies a text in your clipboard
   * @param text Text to copy
   */
  public copyTextToClipboard(text: string) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      this.isCopied = document.execCommand('copy');
    } catch (err) {
      this.isCopied = false;
    }
    document.body.removeChild(textArea);
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
        this.allFields.push({ label: (parentPrefix ? parentPrefix : '') + fieldName, type: fieldList[fieldName].type });
    }
  }

}
