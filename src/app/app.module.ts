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
import { CommonModule, LOCATION_INITIALIZED } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, Injector, NgModule, forwardRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule, MatCardModule, MatDialogModule,
  MatExpansionModule, MatIconModule, MatRadioModule, MatChipsModule, MatSelectModule,
  MatStepperModule, MatSnackBarModule, MatInputModule, MatProgressBarModule, MatListModule,
  MatTooltipModule, MatTableModule, MatCheckboxModule,
  MatFormFieldModule, MatProgressSpinnerModule
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  DonutModule, HistogramModule, PowerbarsModule, ResultsModule, ColorGeneratorModule,
  ColorGeneratorLoader, MetricModule
} from 'arlas-web-components';
import { Observable } from 'rxjs';
import { AppComponent } from './app.component';
import { routing } from './app.routes';
import { AnalyticsBoardComponent } from './components/analytics-board/analytics-board.component';
import { ErrorModalMsgComponent, ErrormodalComponent } from './components/errormodal/errormodal.component';
import { LanguageSwitcherComponent } from './components/language-switcher/language-switcher.component';
import { ExcludeTypePipe } from './components/share/exclude-type.pipe';
import { ShareComponent, ShareDialogComponent } from './components/share/share.component';
import { WidgetComponent } from './components/widget/widget.component';
import { ArlasBookmarkService } from './services/bookmark/bookmark.service';
import { ArlasCollaborativesearchService, ArlasStartupService, ArlasConfigService } from './services/startup/startup.service';
import { ArlasAoiService } from './services/aoi/aoi.service';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';
import { TimelineComponent } from './components/timeline/timeline/timeline.component';
import { TimelineShortcutComponent } from './components/timeline/timeline-shortcut/timeline-shortcut.component';
import { GetTimeLabelPipe } from './pipes/get-time-label.pipe';
import { DatePickerComponent } from './components/timeline/date-picker/date-picker.component';
import {
  OwlDateTimeModule, OwlNativeDateTimeModule, OwlDateTimeIntl,
  OWL_DATE_TIME_LOCALE, OwlMomentDateTimeModule
} from '@gisaia-team/ng-pick-datetime';
import { ArlasTranslateIntl } from './components/timeline/date-picker/ArlasTranslateIntl';
import { ArlasColorGeneratorLoader } from './services/color-generator-loader/color-generator-loader.service';
import { ArlasWalkthroughService } from './services/walkthrough/walkthrough.service';
import { FiltersComponent } from './components/filters/filters.component';
import { SearchComponent } from './components/search/search.component';
import { MatAutocompleteModule } from '@angular/material';
import { DownloadComponent, DownloadDialogComponent } from './components/download/download.component';
import { AoiComponent } from './components/aoi/aoi.component';
import { ExtendComponent } from './components/extend/extend.component';
import { BookmarkComponent, BookmarkAddDialogComponent } from './components/bookmark/bookmark.component';
import { BookmarkMenuComponent } from './components/bookmark-menu/bookmark-menu.component';
import { ArlasExtendService } from './services/extend/extend.service';
import { ArlasConfigurationDescriptor } from './services/configuration-descriptor/configurationDescriptor.service';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { OAuthModule, OAuthModuleConfig, OAuthStorage, ValidationHandler, JwksValidationHandler } from 'angular-oauth2-oidc';
import { AuthentificationService } from './services/authentification/authentification.service';
import { ArlasMapSettings } from './services/map-settings/map-settings.service';


export class CustomTranslateLoader implements TranslateLoader {

  constructor(private http: HttpClient) { }

  public getTranslation(lang: string): Observable<any> {
    const apiAddress = 'assets/i18n/' + lang + '.json?' + Date.now();
    return Observable.create(observer => {
      this.http.get(apiAddress).subscribe(
        res => {
          observer.next(res);
          observer.complete();
        },
        error => {
          // failed to retrieve requested language file, use default
          observer.complete(); // => Default language is already loaded
        }
      );
    });
  }
}

export function startupServiceFactory(startupService: ArlasStartupService) {

  const load = () => startupService.load('config.json?' + Date.now());
  return load;
}

export function configServiceFactory(config: ArlasConfigService) {
  return config;
}

export function auhtentServiceFactory(service: AuthentificationService) {
  return service;
}

export function walkthroughServiceFactory(walkthroughService: ArlasWalkthroughService) {
  const load = () => walkthroughService.load('tour.json?' + Date.now());
  return load;
}

export function localDatePickerFactory(translate: TranslateService) {
  return translate.currentLang;
}

export function translationServiceFactory(translate: TranslateService, injector: Injector) {
  const translationLoaded = () => new Promise<any>((resolve: any) => {
    const url = window.location.href;
    const paramLangage = 'lg';
    // Set default language to current browser language
    let langToSet = navigator.language.slice(0, 2);
    const regex = new RegExp('[?&]' + paramLangage + '(=([^&#]*)|&|#|$)');
    const results = regex.exec(url);
    if (results && results[2]) {
      langToSet = decodeURIComponent(results[2].replace(/\+/g, ' '));
    }
    const locationInitialized = injector.get(LOCATION_INITIALIZED, Promise.resolve(null));
    locationInitialized.then(() => {
      translate.setDefaultLang('en');
      translate.use(langToSet).subscribe(() => {
        console.log(`Successfully initialized '${langToSet}' language.`);
      }, err => {
        console.error(`Problem with '${langToSet}' language initialization.'`);
      }, () => {
        resolve(null);
      });
    });
  });
  return translationLoaded;
}

// We need a factory since localStorage is not available at AOT build time
export function storageFactory(config: ArlasConfigService): OAuthStorage {
  return localStorage;
}

export function getAuthModuleConfig(): OAuthModuleConfig {
  return <OAuthModuleConfig>{};
}


@NgModule({
  declarations: [
    AnalyticsBoardComponent,
    AoiComponent,
    AppComponent,
    BookmarkComponent,
    BookmarkAddDialogComponent,
    BookmarkMenuComponent,
    ConfirmModalComponent,
    DatePickerComponent,
    DownloadComponent,
    DownloadDialogComponent,
    ErrormodalComponent,
    ErrorModalMsgComponent,
    ExcludeTypePipe,
    ExtendComponent,
    FiltersComponent,
    GetTimeLabelPipe,
    LanguageSwitcherComponent,
    SearchComponent,
    ShareComponent,
    ShareDialogComponent,
    TimelineComponent,
    TimelineShortcutComponent,
    WidgetComponent
  ],
  exports: [
    AnalyticsBoardComponent,
    AoiComponent,
    AppComponent,
    BookmarkComponent,
    BookmarkMenuComponent,
    DownloadComponent,
    ExtendComponent,
    FiltersComponent,
    GetTimeLabelPipe,
    LanguageSwitcherComponent,
    SearchComponent,
    ShareComponent,
    TimelineComponent,
    TimelineShortcutComponent,
    TranslateModule,
    WidgetComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    DonutModule,
    DragDropModule,
    FormsModule,
    HistogramModule,
    MetricModule,
    HttpClientModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDialogModule,
    MatExpansionModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatProgressBarModule,
    MatRadioModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSnackBarModule,
    MatStepperModule,
    MatTableModule,
    MatTooltipModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    OwlMomentDateTimeModule,
    PowerbarsModule,
    ReactiveFormsModule,
    ResultsModule,
    RouterModule,
    routing,
    ColorGeneratorModule.forRoot({
      loader: {
        provide: ColorGeneratorLoader,
        useClass: ArlasColorGeneratorLoader
      }
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: CustomTranslateLoader,
        deps: [HttpClient]
      }
    }),
    OAuthModule.forRoot()
  ],
  providers: [
    forwardRef(() => ArlasAoiService),
    forwardRef(() => ArlasBookmarkService),
    forwardRef(() => ArlasConfigService),
    forwardRef(() => ArlasCollaborativesearchService),
    forwardRef(() => AuthentificationService),
    forwardRef(() => ArlasStartupService),
    forwardRef(() => ArlasMapSettings),
    forwardRef(() => ArlasConfigurationDescriptor),
    forwardRef(() => ArlasColorGeneratorLoader),
    forwardRef(() => ArlasExtendService),
    forwardRef(() => ArlasWalkthroughService),

    {
      provide: APP_INITIALIZER,
      useFactory: startupServiceFactory,
      deps: [ArlasStartupService],
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
      provide: APP_INITIALIZER,
      useFactory: walkthroughServiceFactory,
      deps: [ArlasWalkthroughService],
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: translationServiceFactory,
      deps: [TranslateService, Injector],
      multi: true
    },
    {
      provide: OWL_DATE_TIME_LOCALE,
      useFactory: localDatePickerFactory,
      deps: [TranslateService]
    },
    { provide: OwlDateTimeIntl, useClass: ArlasTranslateIntl, deps: [TranslateService] },
    {
      provide: OAuthModuleConfig,
      deps: [ArlasConfigService],
      useFactory: getAuthModuleConfig
    },
    {
      provide: ValidationHandler,
      useClass: JwksValidationHandler
    },
    {
      provide: OAuthStorage,
      deps: [ArlasConfigService],
      useFactory: storageFactory
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
