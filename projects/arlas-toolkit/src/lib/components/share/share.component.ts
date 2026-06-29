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
import { SelectionModel } from '@angular/cdk/collections';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, inject, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDivider, MatListModule, MatListOption } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTooltipModule } from '@angular/material/tooltip';
import { marker } from '@colsen1991/ngx-translate-extract-marker';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Aggregation, Search } from 'arlas-api';
import { ARLAS_VSET, LayerIdToName } from 'arlas-map';
import {
  ClusterLayerCourceConfig, FeatureLayerSourceConfig, LayerSourceConfig, MapContributor, TopologyLayerSourceConfig
} from 'arlas-web-contributors';
import { projType } from 'arlas-web-core';
import FileSaver from 'file-saver';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';
import { ArlasCollaborativesearchService } from '../../services/collaborative-search/arlas.collaborative-search.service';
import { ArlasConfigService } from '../../services/startup/startup.service';
import { orderAlphabeticallyArlasSearchFields } from '../../tools/utils';
import { AdmonitionCardComponent } from '../admonition-card/admonition-card.component';
import { ExcludeTypePipe } from './exclude-type.pipe';
import { ArlasSearchField } from './model/ArlasSearchField';


export type ShareLayerSourceConfig = LayerSourceConfig & { visualisationName: string; };

/**
 * This component allows to build a _geoaggregate and/or _geosearch requests through a guiding stepper and download the request result
 * as a json file after clicking on a "Download" button
 * Note: This component is binded to ARLAS-wui configuration.
 */
@Component({
  selector: 'arlas-share',
  template: ''
})
export class ShareComponent {
  private readonly dialog = inject(MatDialog);

  public openDialog(visibilityStatus?: Map<string, boolean>) {
    this.dialog.open(ShareDialogComponent, { data: visibilityStatus, width: '80vw' });
  }
}


interface GeojsonType {
  source: string;
  id: string;
}

@Component({
  selector: 'arlas-share-dialog',
  templateUrl: './share-dialog.component.html',
  styleUrls: ['./share-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [
    MatStepperModule,
    AdmonitionCardComponent,
    ReactiveFormsModule,
    TranslatePipe,
    MatDivider,
    NgxSpinnerComponent,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatRadioModule,
    MatFormFieldModule,
    MatSelectModule,
    LayerIdToName,
    MatListModule,
    ExcludeTypePipe,
    MatDialogModule
  ]
})
export class ShareDialogComponent implements OnInit {

  public sharableLayers: Array<ShareLayerSourceConfig> = new Array();
  private request: Aggregation | Search | undefined;

  private readonly maxForFeature: number;
  private readonly maxForTopology: number;

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

  public geojsonTypeGroup = new FormGroup({
    geojsonType: new FormControl<GeojsonType | null>(null, Validators.required)
  });
  public paramFormGroup = new FormGroup({
      precision: new FormControl(0, Validators.required),
      availableFields: new FormControl<string[]>([], Validators.required),
      orderField: new FormControl(''),
      orderDirection: new FormControl('')
    });

  public selectedFields = new Array<ArlasSearchField>();
  public selectedOrderField: ArlasSearchField | undefined;
  public sortDirection: 'asc' | 'desc' = 'asc';

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
    private readonly collaborativeService: ArlasCollaborativesearchService,
    private readonly configService: ArlasConfigService,
    private readonly dialogRef: MatDialogRef<ShareDialogComponent>,
    private readonly spinner: NgxSpinnerService,
    private readonly translate: TranslateService,
    private readonly snackBar: MatSnackBar,
  ) {
    this.shareConfig = this.configService.getValue('arlas.web.components.share.geojson');
    this.maxForFeature = this.shareConfig['max_for_feature'];
    this.maxForTopology = (
      this.shareConfig['max_for_topology'] ?
        this.shareConfig['max_for_topology'] : 1000
    );
  }

  public isSelected(field: ArlasSearchField): boolean {
    return (this.selectedFields || []).some(f => f.label === field.label);
  }
  public ngOnInit() {
    this.shareConfig['sort_excluded_type'].forEach((element: string) => {
      this.excludedType.add(element);
      this.excludedTypeString += element + ', ';
    });
    this.excludedTypeString = this.excludedTypeString.substr(0, this.excludedTypeString.length - 2);
    this.sharableLayers = [];
    this.configService.getValue('arlas.web.contributors').forEach((contrib: any) => {
      if (contrib.type === 'map') {
        if (!!this.data) {
          this.data.forEach((vs, lv) => {
            const visualisationLayer = lv.split(ARLAS_VSET);
            if (visualisationLayer.length === 2) {
              const id = visualisationLayer[1];
              if (contrib.layers_sources) {
                const layer = contrib.layers_sources.find((ls: any) => ls.id === id);
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
  public changeStep(event: StepperSelectionEvent) {
    /* STEP 2 */
    if (event.selectedIndex === 1) {
      const geojsonType = this.geojsonTypeGroup.value.geojsonType as GeojsonType;
      const layerSource = this.sharableLayers.find(sl => sl.id === geojsonType.id);
      if (layerSource?.source.startsWith('feature') && !layerSource.source.startsWith('feature-metric')) {
        this.paramFormGroup.controls.precision.disable();
        this.paramFormGroup.controls.availableFields.enable();
        this.request = MapContributor.getFeatureSearch(layerSource as FeatureLayerSourceConfig);
        this.request.page ??= { size: 0 };
        this.request.page.size = this.maxForFeature;
        this.allFields = [];
        this.selectedFields = [];
        if (this.allFields.length === 0) {
          const collection = this.layerCollectionMap.get(layerSource.id);
          if (!collection) {
            return;
          }

          this.collaborativeService.describe(collection).subscribe(
            description => {
              const fields = description.properties;
              if (fields) {
                Object.keys(fields).forEach(fieldName => {
                  this.getFieldProperties(fields, fieldName);
                });
                this.allFields.sort(orderAlphabeticallyArlasSearchFields);
              }
              const search = this.request as Search;
              if (search.projection?.includes) {
                search.projection.includes.split(',').forEach(f => {
                  const selectedField = this.allFields.find(field => field.label === f);
                  if (selectedField) {
                    this.selectedFields.push(selectedField);
                  }
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
      } else if (layerSource?.source.startsWith('cluster')) {
        this.paramFormGroup.controls.precision.enable();
        this.paramFormGroup.controls.availableFields.disable();
        this.request = MapContributor.getClusterAggregration(layerSource as ClusterLayerCourceConfig);
      } else if (layerSource?.source.startsWith('feature-metric')) {
        this.request = MapContributor.getTopologyAggregration(layerSource as TopologyLayerSourceConfig);
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
  public exportGeojson(geojsonType: GeojsonType | undefined | null) {
    if (!geojsonType) {
      return;
    }

    this.spinner.show('downloadgeojson');
    const fileDate = Date.now();

    const collection = this.layerCollectionMap.get(geojsonType.id);
    if (!collection) {
      return;
    }

    if (geojsonType.source.startsWith('feature') && !geojsonType.source.startsWith('feature-metric')) {
      const search = this.request as Search;
      /** add chosen fields to include in the request */
      if (!!this.selectedFields && this.selectedFields.length > 0) {
        const include = new Array<string>();
        this.selectedFields.forEach(field => {
          include.push(field.label);
        });
        /** incude param is comma separated field paths */
        search.projection ??= {};
        search.projection.includes = include.join(',');
      }
      /** add sort on chosen fields to the request */
      if (!!this.selectedOrderField) {
        search.page ??= {
          size: this.maxForFeature
        };
        search.page.sort = (this.sortDirection === 'desc' ? '-' : '') + this.selectedOrderField.label;
      }

      this.collaborativeService.resolveButNotFeatureCollection([projType.geosearch, search], this.collaborativeService.collaborations, collection)
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
      const aggregation = this.request as Aggregation;
      if (geojsonType.source.startsWith('cluster') && this.paramFormGroup.value.precision) {
        aggregation.interval ??= { value: 0 };
        aggregation.interval.value = this.paramFormGroup.value.precision;
      }
      this.collaborativeService.resolveButNotFeatureCollection([projType.geoaggregate, [aggregation]],
        this.collaborativeService.collaborations, collection)
        .subscribe({next: f => {
          this.saveJson(f, (this.translate.instant(geojsonType.id) + '').toLowerCase().replaceAll(' ', '_') + '-' + fileDate + '-geojson.json');
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

  public exportShapefile(geojsonType: GeojsonType | null | undefined) {
    if (!geojsonType) {
      return;
    }

    this.spinner.show('downloadshapefile');

    const collection = this.layerCollectionMap.get(geojsonType.id);
    if (!collection) {
      return;
    }

    if (geojsonType.source.startsWith('feature') && !geojsonType.source.startsWith('feature-metric')) {
      this.request = (this.request as Search);
      /** add chosen fields to include in the request */
      if (!!this.selectedFields && this.selectedFields.length > 0) {
        const include = new Array<string>();
        this.selectedFields.forEach(field => {
          include.push(field.label);
        });
        /** incude param is comma separated field paths */
        this.request.projection ??= {};
        this.request.projection.includes = include.join(',');
      }
      /** add sort on chosen fields to the request */
      if (this.selectedOrderField) {
        this.request.page ??= { size: this.maxForFeature };
        this.request.page.sort = (this.sortDirection === 'desc' ? '-' : '') + this.selectedOrderField.label;
      }
      this.collaborativeService.resolveButNotShapefile([projType.shapesearch, this.request],
        this.collaborativeService.collaborations, collection)
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
      if (geojsonType.source.startsWith('cluster') && this.paramFormGroup.value.precision) {
        this.request.interval ??= { value: 0 };
        this.request.interval.value = this.paramFormGroup.value.precision;
      }
      this.collaborativeService.resolveButNotShapefile([projType.shapeaggregate, [this.request]],
        this.collaborativeService.collaborations, collection)
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
        const replacement: Record<string, any> = {};
        for (const k in value) {
          if (Object.hasOwnProperty.call(value, k)) {
            const matches = k.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g);
            if (matches) {
              replacement[
                matches.map(x => x.toLowerCase()).join(separator)
              ] = value[k];
            }
          }
        }
        return replacement;
      }
      return value;
    }, 2)], { type: 'application/json;charset=utf-8' });
    FileSaver.saveAs(blob, filename);
  }

}
