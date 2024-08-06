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
import { Component, Inject, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthentificationService } from '../../services/authentification/authentification.service';
import { CollectionReferenceDescription } from 'arlas-api';
import { projType } from 'arlas-web-core';
import { ArlasCollaborativesearchService, ArlasConfigService } from '../../services/startup/startup.service';
import { ArlasSearchField } from '../share/model/ArlasSearchField';
import { DeviceDetectorService, OS } from 'ngx-device-detector';
import { orderAlphabeticallyArlasSearchFields } from '../../tools/utils';
import { MatLegacySelectionList as MatSelectionList, MatLegacyListOption as MatListOption } from '@angular/material/legacy-list';
import { SelectionModel } from '@angular/cdk/collections';

export const ARLAS_HITS_EXPORTER_VERSION = 2.2;

@Component({
  selector: 'arlas-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.css']
})
export class DownloadComponent {

  @Input() public icon = 'get_app';
  @Input() public collections;


  public constructor(
    public dialog: MatDialog
  ) { }

  public openDialog() {
    this.dialog.open(DownloadDialogComponent, { data: this.collections }
    );
  }
}

@Component({
  selector: 'arlas-download-dialog',
  templateUrl: './download-dialog.component.html',
  styleUrls: ['./download-dialog.component.scss'],
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

  public exportTypeGroup: UntypedFormGroup;
  public paramFormGroup: UntypedFormGroup;
  public collectionRef: CollectionReferenceDescription;

  public operatingSystems = ['Linux/Mac', 'Windows'];
  public detectedOs = 'Linux/Mac';

  public arlasHitsExporterVersion = ARLAS_HITS_EXPORTER_VERSION;
  public collections;
  public selectedCollection;
  public serverUrl;
  @ViewChild('selectedList', { static: false }) public selectionList: MatSelectionList;

  public constructor(
    @Inject(MAT_DIALOG_DATA) public data: string[],
    private formBuilder: UntypedFormBuilder,
    private collaborativeService: ArlasCollaborativesearchService,
    private configService: ArlasConfigService,
    private authService: AuthentificationService,
    private deviceService: DeviceDetectorService,
  ) {
    this.collections = data;
    this.selectedCollection = data[0];
  }

  public ngOnInit() {
    this.serverUrl = this.configService.getValue('arlas.server').url;
    if (this.deviceService.os === OS.WINDOWS) {
      this.detectedOs = 'Windows';
    }

    this.exportTypeGroup = this.formBuilder.group({
      exportType: ['', Validators.required]
    });
    this.paramFormGroup = this.formBuilder.group({
      availableFields: ['', Validators.required]
    });
    this.setCollectionField(this.selectedCollection);
  }

  public onSelectionChange(selectedOptionsList: SelectionModel<MatListOption>) {
    this.selectedFields = new Array<ArlasSearchField>();
    this.selectedFieldString = '';
    selectedOptionsList.selected.forEach((option, index) => {
      const field = option.getLabel().split('-');
      this.selectedFields.push(new ArlasSearchField(field[0].trim(), field[1].trim()));
      this.selectedFieldString += (index !== 0 ? ',' : '') + field[0].trim();
    });
  }

  public collectionChange(event) {
    this.selectedFields = new Array<ArlasSearchField>();
    this.selectionList.deselectAll();
    this.setCollectionField(this.selectedCollection);
  }

  public setCollectionField(collection) {
    this.collaborativeService.describe(collection).subscribe(
      description => {
        this.allFields = [];
        this.collectionRef = description;
        const fields = description.properties;
        if (fields) {
          Object.keys(fields).forEach(fieldName => {
            this.getFieldProperties(fields, fieldName);
          });
          this.allFields.sort(orderAlphabeticallyArlasSearchFields);
        }

      },
      error => {
        this.collaborativeService.collaborationErrorBus.next(error);
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
      const filters = Array.from(this.collaborativeService.collaborations.values()).filter(element =>
        !!element.filters.get(this.selectedCollection) && element.filters.get(this.selectedCollection).length > 0)
        .map(element => element.filters.get(this.selectedCollection)[0]);
      this.filterUrl = this.collaborativeService.getUrl([projType.search, []], filters);
      if (!!this.authService.accessToken) {
        this.authTypeCommand = '--auth=token --token=' + this.authService.accessToken;
      }
    }
  }

  public copyCommand(downloadCommand, downloadCommandWindows) {
    if (this.detectedOs === 'Windows') {
      this.copyTextToClipboard((downloadCommandWindows as HTMLTextAreaElement).value);
    } else {
      this.copyTextToClipboard((downloadCommand as HTMLTextAreaElement).value);
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
