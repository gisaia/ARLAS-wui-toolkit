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
import { HttpModule } from '@angular/http';
import {
  MatButtonModule, MatCardModule, MatDialogModule,
  MatExpansionModule, MatIconModule, MatRadioModule, MatChipsModule, MatSelectModule,
  MatStepperModule, MatSnackBarModule, MatInputModule, MatProgressBarModule, MatListModule
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

import { DonutModule, HistogramModule, PowerbarsModule, ResultsModule } from 'arlas-web-components';
import { Observable } from 'rxjs/Observable';

import { AppComponent } from './app.component';
import { routing } from './app.routes';
import { AnalyticsBoardComponent } from './components/analytics-board/analytics-board.component';
import { ErrorModalMsgComponent, ErrormodalComponent } from './components/errormodal/errormodal.component';
import { LanguageSwitcherComponent } from './components/language-switcher/language-switcher.component';
import { ExcludeTypePipe } from './components/share/exclude-type.pipe';
import { ShareComponent, ShareDialogComponent } from './components/share/share.component';
import { TagComponent, TagDialogComponent } from './components/tag/tag.component';
import { WidgetComponent } from './components/widget/widget.component';
import { ArlasBookmarkService } from './services/bookmark/bookmark.service';
import { ArlasCollaborativesearchService, ArlasConfigService, ArlasStartupService } from './services/startup/startup.service';
import { ArlasTagService } from './services/tag/tag.service';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';
import { TimelineComponent, TimelineShortcutComponent } from './components/timeline/timeline.component';

export class CustomTranslateLoader implements TranslateLoader {

  constructor(private http: HttpClient) { }

  public getTranslation(lang: string): Observable<any> {
    const apiAddress = 'assets/i18n/' + lang + '.json';
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
    ConfirmModalComponent,
    ErrormodalComponent,
    ErrorModalMsgComponent,
    WidgetComponent,
    AnalyticsBoardComponent,
    ShareComponent,
    ShareDialogComponent,
    TagComponent,
    TagDialogComponent,
    ExcludeTypePipe,
    LanguageSwitcherComponent,
    TimelineComponent,
    TimelineShortcutComponent
  ],
  exports: [
    AppComponent,
    WidgetComponent,
    AnalyticsBoardComponent,
    TimelineComponent,
    TimelineShortcutComponent,
    ShareComponent,
    TagComponent,
    LanguageSwitcherComponent,
    TranslateModule
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    DonutModule,
    FormsModule,
    HistogramModule,
    HttpModule,
    HttpClientModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatExpansionModule,
    MatIconModule,
    MatInputModule,
    MatProgressBarModule,
    MatSelectModule,
    MatListModule,
    MatSnackBarModule,
    MatStepperModule,
    MatRadioModule,
    MatChipsModule,
    PowerbarsModule,
    ReactiveFormsModule,
    ResultsModule,
    RouterModule,
    routing,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: CustomTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    forwardRef(() => ArlasConfigService),
    forwardRef(() => ArlasCollaborativesearchService),
    forwardRef(() => ArlasStartupService),
    forwardRef(() => ArlasBookmarkService),
    forwardRef(() => ArlasTagService),

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
  entryComponents: [ErrorModalMsgComponent, ShareDialogComponent, TagDialogComponent, ConfirmModalComponent],
})
export class ArlasToolKitModule { }
