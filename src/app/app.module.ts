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

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule, LOCATION_INITIALIZED } from '@angular/common';
import { ArlasStartupService, ArlasConfigService, ArlasCollaborativesearchService } from './services/startup/startup.service';
import { NgModule, APP_INITIALIZER, forwardRef, Injector } from '@angular/core';
import { CollaborativesearchService } from 'arlas-web-core';
import { AppComponent } from './app.component';
import { ErrormodalComponent, ErrorModalMsgComponent } from './components/errormodal/errormodal.component';
import {
  MatDialogModule, MatCard, MatCardModule, MatSelectModule,
  MatExpansionModule, MatIconModule, MatRadioModule, MatStepperModule, MatButtonModule
} from '@angular/material';
import { WidgetComponent } from './components/widget/widget.component';
import { HistogramModule } from 'arlas-web-components/histogram/histogram.module';
import { PowerbarsModule } from 'arlas-web-components/powerbars/powerbars.module';
import { AnalyticsBoardComponent } from './components/analytics-board/analytics-board.component';
import { ArlasBookmarkService } from './services/bookmark/bookmark.service';
import { RouterModule } from '@angular/router';
import { routing } from './app.routes';
import { ResultsModule } from 'arlas-web-components/results/results.module';
import { ShareComponent, ShareDialogComponent } from './components/share/share.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExcludeTypePipe } from './components/share/exclude-type.pipe';
import { DonutModule } from 'arlas-web-components/donut/donut.module';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LanguageSwitcherComponent } from './components/language-switcher/language-switcher.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function startupServiceFactory(startupService: ArlasStartupService) {
  const load = () => startupService.load('config.json');
  return load;
}

export function translationServiceFactory(translate: TranslateService, injector: Injector) {
  const translationLoaded = () => new Promise<any>((resolve: any) => {
    const url = window.location.href;
    const paramLangage = 'lg';
    let langToSet = 'en';
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

@NgModule({
  declarations: [
    AppComponent,
    ErrormodalComponent,
    ErrorModalMsgComponent,
    WidgetComponent,
    AnalyticsBoardComponent,
    ShareComponent,
    ShareDialogComponent,
    ExcludeTypePipe,
    LanguageSwitcherComponent
  ],
  exports: [AppComponent, WidgetComponent, AnalyticsBoardComponent, ShareComponent, LanguageSwitcherComponent, TranslateModule],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    HistogramModule,
    HttpModule,
    HttpClientModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatExpansionModule,
    MatIconModule,
    MatSelectModule,
    MatStepperModule,
    MatRadioModule,
    PowerbarsModule,
    ReactiveFormsModule,
    ResultsModule,
    RouterModule,
    routing,
    DonutModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    forwardRef(() => ArlasConfigService),
    forwardRef(() => ArlasCollaborativesearchService),
    forwardRef(() => ArlasStartupService),
    forwardRef(() => ArlasBookmarkService),

    {
      provide: APP_INITIALIZER,
      useFactory: startupServiceFactory,
      deps: [ArlasStartupService],
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: translationServiceFactory,
      deps: [TranslateService, Injector],
      multi: true
    }],
  bootstrap: [AppComponent],
  entryComponents: [ErrorModalMsgComponent, ShareDialogComponent],
})
export class ArlasToolKitModule { }
