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
import { APP_INITIALIZER, forwardRef, InjectionToken, NgModule } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OwlDateTimeIntl, OWL_DATE_TIME_LOCALE } from '@danielmoncada/angular-datetime-picker';
import { TranslateService } from '@ngx-translate/core';
import { OAuthModule, ValidationHandler } from 'angular-oauth2-oidc';
import { JwksValidationHandler } from 'angular-oauth2-oidc-jwks';
import { ColorGeneratorLoader, ColorGeneratorModule, ShortenNumberPipe } from 'arlas-web-components';
import { ToolkitComponent } from './toolkit.component';
import { DeviceDetectorService } from 'ngx-device-detector';
import { isArray } from 'util';
import { BookmarkAddDialogComponent, BookmarkComponent } from './components/bookmark/bookmark.component';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';
import { DownloadDialogComponent } from './components/download/download.component';
import { ErrorModalMsgComponent } from './components/errormodal/errormodal.component';
import { ErrorModalModule } from './components/errormodal/errormodal.module';
import { ArlasTranslateIntl } from './components/timeline/date-picker/ArlasTranslateIntl';
import { ArlasAoiService } from './services/aoi/aoi.service';
import { ArlasIamService } from './services/arlas-iam/arlas-iam.service';
import { AuthGuardIamService } from './services/arlas-iam/auth-guard-iam.service';
import { AuthentificationService } from './services/authentification/authentification.service';
import { ArlasBookmarkService } from './services/bookmark/bookmark.service';
import { ArlasColorGeneratorLoader } from './tools/color-generator-loader';
import { ArlasConfigurationDescriptor } from './services/configuration-descriptor/configurationDescriptor.service';
import { ErrorService } from './services/error/error.service';
import { ArlasExportCsvService } from './services/export-csv/export-csv.service';
import { ArlasExtendService } from './services/extend/extend.service';
import { ArlasMapSettings } from './services/map-settings/map-settings.service';
import { ArlasMapService } from './services/map/map.service';
import { PermissionService } from './services/permission/permission.service';
import { PersistenceService } from './services/persistence/persistence.service';
import { ArlasSettingsService } from './services/settings/arlas.settings.service';
import {
  ArlasCollaborativesearchService, ArlasConfigService, ArlasStartupService, CONFIG_UPDATER, FETCH_OPTIONS
} from './services/startup/startup.service';
import { ArlasWalkthroughService } from './services/walkthrough/walkthrough.service';
import { ArlasToolkitSharedModule } from './shared.module';
import { ToolkitRoutingModule } from './toolkit-routing.module';
import { GET_OPTIONS } from './tools/utils';
import { PaginatorI18n } from './tools/paginatori18n';



export function startupServiceFactory(startupService: ArlasStartupService) {
  const load = () => startupService.load();
  return load;
}

export function settingsServiceFactory(settings: ArlasSettingsService) {
  return settings;
}

export function configServiceFactory(config: ArlasConfigService) {
  return config;
}

export function auhtentServiceFactory(service: AuthentificationService) {
  return service;
}

export function localDatePickerFactory(translate: TranslateService) {
  return translate.currentLang;
}

export function configUpdaterFactory(x): any {
  return x[0];
}

export function getOptionsFactory(arlasAuthService: AuthentificationService): any {
  const getOptions = () => {
    const token = !!arlasAuthService.accessToken ? arlasAuthService.accessToken : null;
    if (token !== null) {
      return {
        headers: {
          Authorization: 'Bearer ' + token
        }
      };
    } else {
      return {};
    }
  };
  return getOptions;
}

export function configUpdater(data) {
  /** FIX wrong v15 map filters about Infinity values */
  if (!!data[0] && !!data[0].arlas && !!data[0].arlas.web && !!data[0].arlas.web.components.mapgl) {
    const layers = data[0].arlas.web.components.mapgl.input.mapLayers.layers;
    layers.forEach(layer => {
      if (!!layer.filter && Array.isArray(layer.filter)) {
        const filters = [];
        layer.filter.forEach(expression => {
          if (Array.isArray(expression) && expression.length === 3) {
            if (expression[0] === '!=' && expression[2] === 'Infinity') {
              expression = ['<=', (expression[1] as any).replace(/\./g, '_'), Number.MAX_VALUE];
            } else if (expression[0] === '!=' && expression[2] === '-Infinity') {
              expression = ['>=', (expression[1] as any).replace(/\./g, '_'), -Number.MAX_VALUE];
            }
          }
          filters.push(expression);
        });
        layer.filter = filters;
      }
    });
  }
  return data[0];
}

export const MY_CUSTOM_FORMATS = {
  parseInput: 'lll',
  fullPickerInput: 'll LTS',
  datePickerInput: 'lll',
  timePickerInput: 'lll',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'lll',
  monthYearA11yLabel: 'MMMM YYYY',
};

@NgModule({
  imports: [
    ToolkitRoutingModule,
    ArlasToolkitSharedModule,
    BrowserModule,
    BrowserAnimationsModule,
    ErrorModalModule,
    OAuthModule.forRoot()
  ],
  exports: [ToolkitComponent],
  declarations: [ToolkitComponent],
  providers: [
    DeviceDetectorService,
    {
      provide: FETCH_OPTIONS, useValue: {
        referrerPolicy: 'origin'
      }
    },
    {
      provide: CONFIG_UPDATER,
      useValue: configUpdater
    },
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
    forwardRef(() => ArlasAoiService),
    forwardRef(() => ArlasBookmarkService),
    forwardRef(() => ArlasSettingsService),
    forwardRef(() => ArlasConfigService),
    forwardRef(() => ArlasCollaborativesearchService),
    forwardRef(() => AuthentificationService),
    forwardRef(() => ArlasStartupService),
    forwardRef(() => ArlasMapSettings),
    forwardRef(() => ArlasMapService),
    forwardRef(() => ArlasConfigurationDescriptor),
    forwardRef(() => ArlasExtendService),
    forwardRef(() => ArlasWalkthroughService),
    forwardRef(() => ArlasExportCsvService),
    forwardRef(() => PersistenceService),
    forwardRef(() => PermissionService),
    forwardRef(() => ErrorService),
    {
      provide: APP_INITIALIZER,
      useFactory: startupServiceFactory,
      deps: [ArlasStartupService],
      multi: true
    },
    {
      provide: 'ArlasSettingsService',
      useFactory: settingsServiceFactory,
      deps: [ArlasSettingsService],
      multi: true
    },
    {
      provide: 'ArlasConfigService',
      useFactory: configServiceFactory,
      deps: [ArlasConfigService],
      multi: true
    },
    {
      provide: 'AuthentificationService',
      useFactory: auhtentServiceFactory,
      deps: [AuthentificationService],
      multi: true
    },
    {
      provide: OWL_DATE_TIME_LOCALE,
      useFactory: localDatePickerFactory,
      deps: [TranslateService]
    },
    { provide: OwlDateTimeIntl, useClass: ArlasTranslateIntl, deps: [TranslateService] },
    {
      provide: ValidationHandler,
      useClass: JwksValidationHandler
    },
    {
      provide: GET_OPTIONS,
      useFactory: getOptionsFactory,
      deps: [AuthentificationService]
    },
    {
      provide: MatPaginatorIntl,
      deps: [TranslateService],
      useClass: PaginatorI18n
    },
    ShortenNumberPipe,
    AuthGuardIamService,
    ArlasIamService

  ],
  bootstrap: [ToolkitComponent]
})
export class ArlasToolKitModule { }
