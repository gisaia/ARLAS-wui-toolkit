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

import { Injectable } from '@angular/core';
import { ArlasSettings, LinkSettings, ProcessSettings, ResultlistSettings } from '../startup/startup.service';
import { PersistenceSetting } from '../persistence/persistence.service';
import { PermissionSetting } from '../permission/permission.service';
import {AuthentSetting, GeocodingSetting} from '../../tools/utils';

@Injectable({
  providedIn: 'root'
})
export class ArlasSettingsService {
  public settings: ArlasSettings;

  public constructor() { }

  public setSettings(settings: ArlasSettings): void {
    this.settings = settings;
  }

  public getSettings(): ArlasSettings {
    return this.settings;
  }

  public getPersistenceSettings(): PersistenceSetting {
    return !!this.settings && !!this.settings.persistence ? this.settings.persistence : undefined;
  }

  public getPermissionSettings(): PermissionSetting {
    return !!this.settings && !!this.settings.permission ? this.settings.permission : undefined;
  }

  public getGeocodingSettings(): GeocodingSetting {
    return !!this.settings && !!this.settings.geocoding ? this.settings.geocoding : undefined;
  }

  public getArlasWuiUrl(): string {
    return !!this.settings && !!this.settings.arlas_wui_url ? this.settings.arlas_wui_url : undefined;
  }

  public getArlasBuilderUrl(): string {
    return !!this.settings && !!this.settings.arlas_builder_url ? this.settings.arlas_builder_url : undefined;
  }

  public getArlasHubUrl(): string {
    return !!this.settings && !!this.settings.arlas_hub_url ? this.settings.arlas_hub_url : undefined;
  }

  public getArlasIAMWuiUrl(): string {
    return !!this.settings && !!this.settings.arlas_iam_wui_url ? this.settings.arlas_iam_wui_url : undefined;
  }

  public getLinksSettings(): LinkSettings[] {
    return !!this.settings && !!this.settings.links ? this.settings.links : undefined;
  }

  public getTicketingKey(): string {
    return !!this.settings && !!this.settings.ticketing_key && this.settings.ticketing_key !== '' ? this.settings.ticketing_key : undefined;
  }

  public getHistogramMaxBucket(): number {
    return !!this.settings && !!this.settings.histogram && !!this.settings.histogram.max_buckets ? this.settings.histogram.max_buckets : 200;
  }

  public isResultListExportEnabled(): boolean {
    return !!this.settings && !!this.settings.resultlist && !!this.settings.resultlist.enable_export;
  }

  public getResultlistSettings(): ResultlistSettings {
    return !!this.settings && !!this.settings.resultlist ? this.settings.resultlist : undefined;
  }

  public getHistogramNbBucketAtExport(): number {
    return !!this.settings && !!this.settings.histogram && !!this.settings.histogram.export_nb_buckets ?
      this.settings.histogram.export_nb_buckets : 1000;
  }

  public getAuthentSettings(): AuthentSetting {
    return !!this.settings && !!this.settings.authentication ? this.settings.authentication : undefined;
  }

  public getProcessSettings(name: string): ProcessSettings {
    return !!this.settings && !!this.settings.processes ? this.settings.processes.find(p => p.name === name) : undefined;
  }
}
