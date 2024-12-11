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
import { Component, Inject, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Aggregation } from 'arlas-api';
import { projType } from 'arlas-web-core';
import { ArlasSearchField } from './model/ArlasSearchField';
import { ArlasCollaborativesearchService, ArlasConfigService } from '../../services/startup/startup.service';
import { LayerSourceConfig, MapContributor } from 'arlas-web-contributors';

import { Search } from 'arlas-tagger-api';
import * as FileSaver from 'file-saver';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ARLAS_VSET } from 'arlas-web-components';
import { MatSnackBar } from '@angular/material/snack-bar';
import { marker } from '@colsen1991/ngx-translate-extract-marker';
import { orderAlphabeticallyArlasSearchFields } from '../../tools/utils';
import { SelectionModel } from '@angular/cdk/collections';
import { MatListOption } from '@angular/material/list';


export interface ShareLayerSourceConfig extends LayerSourceConfig {
  visualisationName: string;
}

/**
 * This component allows to build a _geoaggregate and/or _geosearch requests through a guiding stepper and download the request result
 * as a json file after clicking on a "Download" button
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

  public constructor(
    public dialog: MatDialog
  ) { }

  public openDialog(visibilityStatus?: Map<string, boolean>) {
    this.dialog.open(ShareDialogComponent, { data: visibilityStatus, width: '80vw' });
  }
}


@Component({
  selector: 'arlas-share-dialog',
  templateUrl: './share-dialog.component.html',
  styleUrls: ['./share-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ShareDialogComponent implements OnInit {

  public sharableLayers: Array<ShareLayerSourceConfig> = new Array();
  private request: Aggregation | Search;

  private maxForFeature: number;
  private maxForTopology: number;

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

  public geojsonTypeGroup: UntypedFormGroup;
  public paramFormGroup: UntypedFormGroup;

  public selectedFields = new Array<ArlasSearchField>();
  public selectedOrderField: ArlasSearchField;
  public sortDirection: string;

  public allFields = new Array<ArlasSearchField>();
  public excludedType = new Set<string>();
  public excludedTypeString = '';
  public shareConfig: any;

  public layerCollectionMap: Map<string, string> = new Map();

  // for now, the ARLAS-server url is fetched from the config in the startup service.
  // we should do the same everywhere, otherwise we will have two sources (settings.yaml (it was env.js) & config.json) to configure
  // the server, and this can lead to incoherences
  public constructor(
    @Inject(MAT_DIALOG_DATA) public data: Map<string, boolean>,
    private _formBuilder: UntypedFormBuilder,
    private collaborativeService: ArlasCollaborativesearchService,
    private configService: ArlasConfigService,
    public dialogRef: MatDialogRef<ShareDialogComponent>,
    private spinner: NgxSpinnerService,
    public translate: TranslateService,
    private snackBar: MatSnackBar,
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
    this.sharableLayers = [];
    this.configService.getValue('arlas.web.contributors').forEach(contrib => {
      if (contrib.type === 'map') {
        if (!!this.data) {
          this.data.forEach((vs, lv) => {
            const visualisationLayer = lv.split(ARLAS_VSET);
            if (visualisationLayer.length === 2) {
              const id = visualisationLayer[1];
              if (contrib.layers_sources) {
                const layer = contrib.layers_sources.find(ls => ls.id === id);
                if (!!layer && vs) {
                  layer.visualisationName = visualisationLayer[0];
                  this.sharableLayers.push(layer);
                  this.layerCollectionMap.set(layer.id, contrib.collection);
                }
              }
            }
          });
        }
      }
    });
  }


  /**
   * Switches between dialog steps
   * @param event The step index
   */
  public changeStep(event) {
    const server = this.configService.getValue('arlas.server');
    /* STEP 2 */
    if (event.selectedIndex === 1) {
      const geojsonType: { source: string; id: string; } = this.geojsonTypeGroup.get('geojsonType').value;
      const layerSource = this.sharableLayers.find(sl => sl.id === geojsonType.id);
      if (layerSource.source.startsWith('feature') && !layerSource.source.startsWith('feature-metric')) {
        this.paramFormGroup.get('precision').disable();
        this.paramFormGroup.get('availableFields').enable();
        this.request = MapContributor.getFeatureSearch(layerSource) as Search;
        this.request.page.size = this.maxForFeature;
        this.allFields = [];
        this.selectedFields = [];
        if (this.allFields.length === 0) {
          this.collaborativeService.describe(this.layerCollectionMap.get(layerSource.id)).subscribe(
            description => {
              const fields = description.properties;
              if (fields) {
                Object.keys(fields).forEach(fieldName => {
                  this.getFieldProperties(fields, fieldName);
                });
                this.allFields.sort(orderAlphabeticallyArlasSearchFields);
              }
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
      } else if (layerSource.source.startsWith('cluster')) {
        this.paramFormGroup.get('precision').enable();
        this.paramFormGroup.get('availableFields').disable();
        this.request = MapContributor.getClusterAggregration(layerSource);
      } else if (layerSource.source.startsWith('feature-metric')) {
        this.request = MapContributor.getTopologyAggregration(layerSource);
        this.request.size = this.maxForTopology.toString();
      }
    }
  }


  /**
   * @param geojsonType Param containing info about the chosen layer to export
   * @description Builds and executes a geosearch/geoaggregate request based on the chosen param of the form
   * and export the result as json file.
   * The exported file name is layerId-date-geojson.json
   */
  public exportGeojson(geojsonType) {
    this.spinner.show('downloadgeojson');
    const fileDate = Date.now();
    if (geojsonType.source.startsWith('feature') && !geojsonType.source.startsWith('feature-metric')) {
      this.request = (this.request as Search);
      /** add chosen fields to include in the request */
      if (!!this.selectedFields && this.selectedFields.length > 0) {
        const include = [];
        this.selectedFields.forEach(field => {
          include.push(field.label);
        });
        /** incude param is comma separated field paths */
        this.request.projection.includes = include.join(',');
      }
      /** add sort on chosen fields to the request */
      if (!!this.selectedOrderField) {
        this.request.page.sort = (this.sortDirection === 'desc' ? '-' : '') + this.selectedOrderField.label;
      }
      this.collaborativeService.resolveButNotFeatureCollection([projType.geosearch, this.request],
        this.collaborativeService.collaborations, this.layerCollectionMap.get(geojsonType.id))
        .subscribe({next: f => {
          this.saveJson(f, (this.translate.instant(geojsonType.id) + '').toLowerCase().replace(/ /g, '_') + '-' + fileDate + '-geojson.json');
          this.spinner.hide('downloadgeojson');
          this.dialogRef.close();
        },
        error: () => {
          this.spinner.hide('downloadgeojson');
          this.snackBar.open(marker('An error occured'));
        }
        });
    } else {
      this.request = (this.request as Aggregation);
      if (geojsonType.source.startsWith('cluster')) {
        this.request.interval.value = this.paramFormGroup.get('precision').value;
      }
      this.collaborativeService.resolveButNotFeatureCollection([projType.geoaggregate, [this.request]],
        this.collaborativeService.collaborations, this.layerCollectionMap.get(geojsonType.id))
        .subscribe({next: f => {
          this.saveJson(f, (this.translate.instant(geojsonType.id) + '').toLowerCase().replace(/ /g, '_') + '-' + fileDate + '-geojson.json');
          this.spinner.hide('downloadgeojson');
          this.dialogRef.close();
        },
        error: () => {
          this.spinner.hide('downloadgeojson');
          this.snackBar.open(marker('An error occured'));
        }
        });
    }
  }

  public exportShapefile(geojsonType) {
    this.spinner.show('downloadshapefile');
    const fileDate = Date.now();
    if (geojsonType.source.startsWith('feature') && !geojsonType.source.startsWith('feature-metric')) {
      this.request = (this.request as Search);
      /** add chosen fields to include in the request */
      if (!!this.selectedFields && this.selectedFields.length > 0) {
        const include = [];
        this.selectedFields.forEach(field => {
          include.push(field.label);
        });
        /** incude param is comma separated field paths */
        this.request.projection.includes = include.join(',');
      }
      /** add sort on chosen fields to the request */
      if (!!this.selectedOrderField) {
        this.request.page.sort = (this.sortDirection === 'desc' ? '-' : '') + this.selectedOrderField.label;
      }
      this.collaborativeService.resolveButNotShapefile([projType.shapesearch, this.request],
        this.collaborativeService.collaborations, this.layerCollectionMap.get(geojsonType.id))
        .subscribe({next: (data) => {
          const blob = new Blob([data], {
            type: 'application/zip'
          });
          const url = window.URL.createObjectURL(blob);
          window.open(url);
          this.spinner.hide('downloadshapefile');
          this.dialogRef.close();
        },
        error: () => {
          this.spinner.hide('downloadshapefile');
          this.snackBar.open(marker('An error occured'));
        }

        });
    } else {
      this.request = (this.request as Aggregation);
      if (geojsonType.source.startsWith('cluster')) {
        this.request.interval.value = this.paramFormGroup.get('precision').value;
      }
      this.collaborativeService.resolveButNotShapefile([projType.shapeaggregate, [this.request]],
        this.collaborativeService.collaborations, this.layerCollectionMap.get(geojsonType.id))
        .subscribe({next: data => {
          const blob = new Blob([data], {
            type: 'application/zip'
          });
          const url = window.URL.createObjectURL(blob);
          window.open(url);
          this.spinner.hide('downloadshapefile');
          this.dialogRef.close();
        },
        error: (err) => {
          this.spinner.hide('downloadshapefile');
          this.snackBar.open(marker('An error occured'));
        }
        });
    }
  }


  public onSelectionChange(selectedOptionsList: SelectionModel<MatListOption>) {
    this.selectedFields = new Array<ArlasSearchField>();
    selectedOptionsList.selected.forEach(option => {
      const field = option.getLabel().split('-');
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

  private saveJson(json: any, filename: string, separator?: string) {
    const blob = new Blob([JSON.stringify(json, (key, value) => {
      if (!!separator && value && typeof value === 'object' && !Array.isArray(value)) {
        // convert keys to snake- or kebab-case (eventually other) according to the separator.
        // In fact we cannot declare a property with a snake-cased name,
        // (so in models interfaces properties are are camel case)
        const replacement = {};
        for (const k in value) {
          if (Object.hasOwnProperty.call(value, k)) {
            replacement[
              k.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
                .map(x => x.toLowerCase())
                .join(separator)
            ] = value[k];
          }
        }
        return replacement;
      }
      return value;
    }, 2)], { type: 'application/json;charset=utf-8' });
    FileSaver.saveAs(blob, filename);
  }

}
