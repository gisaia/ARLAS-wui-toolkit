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
import { APP_INITIALIZER, NgModule, forwardRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateService } from '@ngx-translate/core';
import { ColorGeneratorModule, ColorGeneratorLoader } from 'arlas-web-components';
import { ArlasBookmarkService } from './services/bookmark/bookmark.service';
import {
  ArlasCollaborativesearchService, ArlasStartupService,
  ArlasConfigService, CONFIG_UPDATER, FETCH_OPTIONS
} from './services/startup/startup.service';
import { ArlasAoiService } from './services/aoi/aoi.service';
import { OwlDateTimeIntl, OWL_DATE_TIME_LOCALE } from '@gisaia-team/ng-pick-datetime';
import { ArlasColorGeneratorLoader } from './services/color-generator-loader/color-generator-loader.service';
import { ArlasWalkthroughService } from './services/walkthrough/walkthrough.service';
import { ArlasExtendService } from './services/extend/extend.service';
import { ArlasConfigurationDescriptor } from './services/configuration-descriptor/configurationDescriptor.service';
import { OAuthModule, OAuthModuleConfig, OAuthStorage, ValidationHandler, JwksValidationHandler } from 'angular-oauth2-oidc';
import { AuthentificationService } from './services/authentification/authentification.service';
import { ArlasMapSettings } from './services/map-settings/map-settings.service';
import { ArlasExportCsvService } from './services/export-csv/export-csv.service';
import { ArlasMapService } from './services/map/map.service';
import { GET_OPTIONS, PersistenceService } from './services/persistence/persistence.service';
import { ArlasTranslateIntl } from './components/timeline/date-picker/ArlasTranslateIntl';
import { AppComponent } from './app.component';
import { BookmarkAddDialogComponent, BookmarkComponent } from './components/bookmark/bookmark.component';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';
import { DownloadDialogComponent } from './components/download/download.component';
import { ErrorModalMsgComponent } from './components/errormodal/errormodal.component';
import { ShareDialogComponent } from './components/share/share.component';
import { routing } from './app.routes';
import { ArlasToolkitSharedModule } from './shared.module';
import { ArlasSettingsService } from './services/settings/arlas.settings.service';
import { ErrorModalModule } from './components/errormodal/errormodal.module';
import { ErrorService } from './services/error/error.service';
import { PaginatorI18n } from './tools/paginatori18n';
import { MatPaginatorIntl } from '@angular/material/paginator/';
import { PermissionService } from './services/permission/permission.service';
import { isArray } from 'util';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';



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

export function paginatori18nFactory(translate: TranslateService) {
  const paginatori18n = (translate) => new PaginatorI18n(translate).getPaginatorIntl();
  return paginatori18n;
}

export function configUpdaterFactory(x): any {
  return x[0];
}

export function getOptionsFactory(arlasAuthService: AuthentificationService): any {
  const getOptions = () => {
    const token = !!arlasAuthService.idToken ? arlasAuthService.idToken : null;
    if (token !== null) {
      return {
        headers: {
          Authorization: 'bearer ' + token
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
  if (!!data[0] && !!data[0].arlas && !!data[0].arlas.web) {
    const layers = data[0].arlas.web.components.mapgl.input.mapLayers.layers;
    layers.forEach(layer => {
      if (!!layer.filter && isArray(layer.filter)) {
        const filters = [];
        layer.filter.forEach(expression => {
          if (isArray(expression) && expression.length === 3) {
            if (expression[0] === '!=' && expression[2] === 'Infinity') {
              expression = ['<=', expression[1].replace(/\./g, '_'), Number.MAX_VALUE];
            } else if (expression[0] === '!=' && expression[2] === '-Infinity') {
              expression = ['>=', expression[1].replace(/\./g, '_'), -Number.MAX_VALUE];
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
    ArlasToolkitSharedModule,
    BrowserModule,
    BrowserAnimationsModule,
    routing,
    ColorGeneratorModule.forRoot({
      loader: {
        provide: ColorGeneratorLoader,
        useClass: ArlasColorGeneratorLoader
      }
    }),
    ErrorModalModule,
    OAuthModule.forRoot()
  ],
  exports: [AppComponent],
  declarations: [AppComponent],
  providers: [
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
    forwardRef(() => ArlasColorGeneratorLoader),
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
      useFactory: paginatori18nFactory
    },
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    BookmarkAddDialogComponent,
    BookmarkComponent, // Usefull for bookmark-menu
    ConfirmModalComponent,
    DownloadDialogComponent,
    ErrorModalMsgComponent,
    ShareDialogComponent
  ],
})
export class ArlasToolKitModule { }
