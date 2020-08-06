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
import { MatDialog, MatDialogRef } from '@angular/material';
import { Aggregation, Filter } from 'arlas-api';
import { projType } from 'arlas-web-core';
import { ArlasSearchField } from '../../components/share/model/ArlasSearchField';
import { ArlasCollaborativesearchService, ArlasConfigService } from '../../services/startup/startup.service';
import { LayerSourceConfig, MapContributor } from 'arlas-web-contributors';
import { Search } from 'arlas-tagger-api';

/**
 * This component allows to build a _geoaggregate and/or _geosearch requests through a guiding stepper and obtain
 * a Get request URL at the end.
 * You can use this url to show your geographic data in standard GIS applications.
 * Note: This component is binded to ARLAS-wui configuration.
 */
@Component({
  selector: 'arlas-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ShareComponent {

  @Input() public icon = 'share';

  constructor(
    public dialog: MatDialog
  ) { }

  public openDialog() {
    this.dialog.open(ShareDialogComponent, { data: null });
  }
}


@Component({
  selector: 'arlas-share-dialog',
  templateUrl: './share-dialog.component.html',
  styleUrls: ['./share-dialog.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ShareDialogComponent implements OnInit {

  public sharableLayers: Array<LayerSourceConfig> = new Array();
  private requestEndpoint: projType.geoaggregate | projType.geosearch;
  private requestTextEndpoint = '_geoaggregate';
  private request: Aggregation | Search;
  private includeFields = '';
  private sort = '';

  private maxForFeature: number;
  private maxForTopology: number;
  private filters: Array<Filter> = new Array<Filter>();

  public displayedUrl: string;
  public precisions = [
    [1, '5,009.4km x 4,992.6km'],
    [2, '1,252.3km x 624.1km'],
    [3, '156.5km x 156km'],
    [4, '39.1km x 19.5km'],
    [5, '4.9km x 4.9km'],
    [6, '1.2km x 609.4m'],
    [7, '152.9m x 152.4m'],
    [8, '38.2m x 19m'],
    [9, '4.8m x 4.8m'],
    [10, '1.2m x 59.5cm'],
    [11, '14.9cm x 14.9cm'],
    [12, '3.7cm x 1.9cm']
  ];

  public isCopied = false;
  public geojsonTypeGroup: FormGroup;
  public paramFormGroup: FormGroup;

  public selectedFields = new Array<ArlasSearchField>();
  public selectedOrderField: ArlasSearchField;
  public sortDirection: string;

  public allFields = new Array<ArlasSearchField>();
  public excludedType = new Set<string>();
  public excludedTypeString = '';
  public shareConfig: any;

  // for now, the ARLAS-server url is fetched from the config in the startup service.
  // we should do the same everywhere, otherwise we will have two sources (settings.yaml (it was env.js) & config.json) to configure
  // the server, and this can lead to incoherences
  constructor(
    private _formBuilder: FormBuilder,
    private collaborativeService: ArlasCollaborativesearchService,
    private configService: ArlasConfigService,
    public dialogRef: MatDialogRef<ShareDialogComponent>
  ) { }

  public isSelected(field: ArlasSearchField): boolean {
    return (this.selectedFields || []).some(f => f.label === field.label);
  }
  public ngOnInit() {
    this.geojsonTypeGroup = this._formBuilder.group({
      geojsonType: ['', Validators.required]
    });
    this.paramFormGroup = this._formBuilder.group({
      precision: ['', Validators.required],
      availableFields: ['', Validators.required],
      orderField: [''],
      orderDirection: ['']
    });

    this.shareConfig = this.configService.getValue('arlas.web.components.share.geojson');

    this.maxForFeature = this.shareConfig['max_for_feature'];
    this.maxForTopology = (
      this.shareConfig['max_for_topology'] ?
      this.shareConfig['max_for_topology'] : 1000
    );
    this.shareConfig['sort_excluded_type'].forEach(element => {
      this.excludedType.add(element);
      this.excludedTypeString += element + ', ';
    });
    this.excludedTypeString = this.excludedTypeString.substr(0, this.excludedTypeString.length - 2);

    this.configService.getValue('arlas.web.contributors').forEach(contrib => {
      if (contrib.type === 'map') {
        this.sharableLayers = contrib.layers_sources;
      }
    });
    this.collaborativeService.collaborations.forEach(element =>
      this.filters.push(element.filter)
    );
  }


  /**
   * Switches between dialog steps
   * @param event The step index
   */
  public changeStep(event) {
    const server = this.configService.getValue('arlas.server');
    /* STEP 2 */
    if (event.selectedIndex === 1) {
      this.requestTextEndpoint = '_geoaggregate';
      this.requestEndpoint = projType.geoaggregate;
      const geojsonType: string = this.geojsonTypeGroup.get('geojsonType').value;
      const source = this.sharableLayers.find(sl => sl.source === geojsonType);
      if (geojsonType.startsWith('feature') && !geojsonType.startsWith('feature-metric')) {
        this.paramFormGroup.get('precision').disable();
        this.paramFormGroup.get('availableFields').enable();
        this.requestTextEndpoint = '_geosearch';
        this.requestEndpoint = projType.geosearch;
        this.request = MapContributor.getFeatureSearch(source) as Search;
        this.request.page.size = this.maxForFeature;
        if (this.allFields.length === 0) {
          this.collaborativeService.describe(server.collection.name).subscribe(
            description => {
              const fields = description.properties;
              Object.keys(fields).forEach(fieldName => {
                this.getFieldProperties(fields, fieldName);
              });
              if (!!(<any>this.request).projection && !!(<any>this.request).projection.includes) {
                (<any>this.request).projection.includes.split(',').forEach(f => {
                  const selectedField = this.allFields.find(field => field.label === f);
                  this.selectedFields.push(selectedField);
                });
                this.paramFormGroup.patchValue({
                  'availableFields': this.selectedFields.map(v => v.label)
                });
                this.paramFormGroup.updateValueAndValidity();
              }
            },
            error => {
              this.collaborativeService.collaborationErrorBus.next(error);
            });
        }
      } else if (geojsonType.startsWith('cluster')) {
        this.paramFormGroup.get('precision').enable();
        this.paramFormGroup.get('availableFields').disable();
        this.request = MapContributor.getClusterAggregration(source);
      } else if (geojsonType.startsWith('feature-metric')) {
        this.isCopied = false;
        this.request = MapContributor.getTopologyAggregration(source);
        this.request.size = this.maxForTopology.toString();
        this.displayedUrl = server.url + '/explore/' + server.collection.name + '/'
          + this.requestTextEndpoint + '/?'
          + this.collaborativeService.getUrl([this.requestEndpoint, [this.request]], this.filters) + '&flat=true';
      }
    }
    /* STEP 3 */
    if (event.selectedIndex === 2) {
      this.isCopied = false;
      this.sort = '';
      this.includeFields = '';
      const geojsonType: string = this.geojsonTypeGroup.get('geojsonType').value;
      if (geojsonType.startsWith('feature') && !geojsonType.startsWith('feature-metric')) {
        this.request = (this.request as Search);

        if (this.selectedFields.length > 0) {
          this.includeFields = '&include=';
          this.selectedFields.forEach(field =>
            this.includeFields += field.label + ','
          );
        }

        if (this.selectedOrderField) {
          this.sort = '&sort=' + (this.sortDirection === 'desc' ? '-' : '') + this.selectedOrderField.label;
        }
        this.displayedUrl = server.url + '/explore/' + server.collection.name + '/'
          + this.requestTextEndpoint + '/?'
          + '&size=' + this.request.page.size
          + '&returned_geometries=' +  this.request.returned_geometries
          + this.sort
          + this.includeFields
          + '&flat=true';
      } else {
        this.request = (this.request as Aggregation);
        this.request.interval.value = this.paramFormGroup.get('precision').value;
        this.displayedUrl = server.url + '/explore/' + server.collection.name + '/'
          + this.requestTextEndpoint + '/?'
          + this.collaborativeService.getUrl([this.requestEndpoint, [this.request as Aggregation]], this.filters) + '&flat=true';
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

  public onSelectionChange(selectedOptionsList) {
    this.selectedFields = new Array<ArlasSearchField>();
    selectedOptionsList.forEach(option => {
      const field = option._text.nativeElement.innerText.split('-');
      this.selectedFields.push(new ArlasSearchField(field[0].trim(), field[1].trim()));
    });
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
