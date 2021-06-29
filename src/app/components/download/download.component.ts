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
import { AuthentificationService } from '../../services/authentification/authentification.service';
import { CollectionReferenceDescription } from 'arlas-api';
import { projType } from 'arlas-web-core';
import { ArlasCollaborativesearchService, ArlasConfigService } from '../../services/startup/startup.service';
import { ArlasSearchField } from '../share/model/ArlasSearchField';

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

  public filterUrl: string;
  public exportedTypeCommand: string;
  public authTypeCommand: string;

  public isCopied = false;
  public server: any;

  public exportTypeGroup: FormGroup;
  public paramFormGroup: FormGroup;
  public collectionRef: CollectionReferenceDescription;

  constructor(
    private formBuilder: FormBuilder,
    private collaborativeService: ArlasCollaborativesearchService,
    private configService: ArlasConfigService,
    private authService: AuthentificationService
  ) { }

  public ngOnInit() {
    this.exportTypeGroup = this.formBuilder.group({
      exportType: ['', Validators.required]
    });
    this.paramFormGroup = this.formBuilder.group({
      availableFields: ['', Validators.required]
    });

    // for now, the ARLAS-server url is fetched from the config in the startup service.
    // we should do the same everywhere, otherwise we will have two sources (settings.yaml (it was env.js) & config.json) to configure
    // the server, and this can lead to incoherences
    this.server = this.configService.getValue('arlas.server');
    this.collaborativeService.describe(this.server.collection.name).subscribe(
      description => {
        this.collectionRef = description;
        const fields = description.properties;
        if (fields) {
          Object.keys(fields).forEach(fieldName => {
            this.getFieldProperties(fields, fieldName);
          });
        }
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
  }

  /**
   * Switches between dialog steps
   * @param event The step index
   */
  public changeStep(event) {
    if (event.selectedIndex === 2) {
      this.isCopied = false;
      this.exportedTypeCommand = this.exportTypeGroup.get('exportType').value;
      const filters = Array.from(this.collaborativeService.collaborations.values()).map(element => element.filter);
      this.filterUrl = this.collaborativeService.getUrl([projType.search, []], filters);
      if (!!this.authService.idToken) {
        this.authTypeCommand = '--auth=token --token=' + this.authService.idToken;
      }
    }
  }

  /**
   * Copies a text in your clipboard
   * @param text Text to copy
   */
  public copyTextToClipboard(text: string) {
    const textArea = document.createElement('textarea');
    textArea.value = text.trim();
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
