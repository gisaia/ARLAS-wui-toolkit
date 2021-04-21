/*
Licensed to Gisaïa under one or more contributor
license agreements. See the NOTICE.txt file distributed with
this work for additional information regarding copyright
ownership. Gisaïa licenses this file to you under
the Apache License, Version 2.0 (the "License"); you may
not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied.  See the License for the
specific language governing permissions and limitations
under the License.
*/
import { NgModule } from '@angular/core';
import { ExtendComponent } from './components/extend/extend.component';
import { AnalyticsBoardComponent } from './components/analytics-board/analytics-board.component';
import { LanguageSwitcherComponent } from './components/language-switcher/language-switcher.component';
import { ExcludeTypePipe } from './components/share/exclude-type.pipe';
import { ShareComponent, ShareDialogComponent } from './components/share/share.component';
import { WidgetComponent } from './components/widget/widget.component';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';
import { TimelineComponent } from './components/timeline/timeline/timeline.component';
import { TimelineShortcutComponent } from './components/timeline/timeline-shortcut/timeline-shortcut.component';
import { DatePickerComponent } from './components/timeline/date-picker/date-picker.component';
import { ArlasTranslateIntl } from './components/timeline/date-picker/ArlasTranslateIntl';
import { FiltersComponent } from './components/filters/filters.component';
import { SearchComponent } from './components/search/search.component';
import { DownloadComponent, DownloadDialogComponent } from './components/download/download.component';
import { AoiComponent } from './components/aoi/aoi.component';
import { BookmarkComponent, BookmarkAddDialogComponent } from './components/bookmark/bookmark.component';
import { BookmarkMenuComponent } from './components/bookmark-menu/bookmark-menu.component';
import { ProgressSpinnerComponent } from './components/progress-spinner/progress-spinner.component';
import { GetTimeLabelPipe } from './pipes/get-time-label.pipe';
import { ResultsModule } from 'arlas-web-components/components/results/results.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PowerbarsModule } from 'arlas-web-components/components/powerbars/powerbars.module';
import { CommonModule } from '@angular/common';
import { DonutModule } from 'arlas-web-components/components/donut/donut.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HistogramModule } from 'arlas-web-components/components/histogram/histogram.module';
import { MetricModule } from 'arlas-web-components/components/metric/metric.module';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import {
  MatButtonModule, MatCardModule, MatDialogModule,
  MatExpansionModule, MatIconModule, MatRadioModule, MatChipsModule, MatSelectModule,
  MatStepperModule, MatSnackBarModule, MatInputModule, MatProgressBarModule, MatListModule,
  MatTooltipModule, MatTableModule, MatCheckboxModule,
  MatFormFieldModule, MatProgressSpinnerModule, MatTabsModule, MatPaginatorModule
} from '@angular/material';
import { MatAutocompleteModule } from '@angular/material';
import { OwlDateTimeModule, OwlNativeDateTimeModule, OwlMomentDateTimeModule } from '@gisaia-team/ng-pick-datetime';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { FormatNumberModule, ColorGeneratorModule, ColorGeneratorLoader, MapglLegendModule } from 'arlas-web-components';
import { ErrorModalModule } from './components/errormodal/errormodal.module';
import { ConfigMenuModule } from './components/config-manager/config-menu/config-menu.module';
import { UserInfosComponent } from './components/user-infos/user-infos.component';
import { ReconnectDialogComponent } from './components/reconnect-dialog/reconnect-dialog.component';
import { FetchInterceptorService } from './services/interceptor/fetch-interceptor.service';
import { ActionModalComponent } from './components/config-manager/action-modal/action-modal.component';
import { ActionModalModule } from './components/config-manager/action-modal/action-modal.module';
import en from 'arlas-web-components/assets/i18n/en.json';
import fr from 'arlas-web-components/assets/i18n/fr.json';
import { InvalidConfigDialogComponent } from './components/invalid-config-dialog/invalid-config-dialog.component';
import { ArlasColorGeneratorLoader } from './services/color-generator-loader/color-generator-loader.service';
import { LinkComponent } from './components/link/link.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HistogramWidgetComponent } from './components/histogram-widget/histogram-widget.component';
import { ArlasOverlayService } from './services/overlays/overlay.service';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import { HistogramTooltipOverlayComponent } from './components/histogram-tooltip-overlay/histogram-tooltip-overlay.component';
import { DonutTooltipOverlayComponent } from './components/donut-tooltip-overlay/donut-tooltip-overlay.component';


export class CustomTranslateLoader implements TranslateLoader {

  constructor(private http: HttpClient) { }

  public getTranslation(lang: string): Observable<any> {
    const apiAddress = 'assets/i18n/' + lang + '.json?' + Date.now();
    return Observable.create(observer => {
      this.http.get(apiAddress).subscribe(
        res => {
          let merged = res;
          // Properties in res will overwrite those in fr.
          if (lang === 'fr') {
            merged = { ...fr, ...res };
          } else if (lang === 'en') {
            merged = { ...en, ...res };
          }
          observer.next(merged);
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

@NgModule({

  imports: [
    ActionModalModule,
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
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSnackBarModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatTooltipModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    OwlMomentDateTimeModule,
    PowerbarsModule,
    ReactiveFormsModule,
    ResultsModule,
    ConfigMenuModule,
    ScrollDispatchModule,
    FormatNumberModule,
    ErrorModalModule,
    NgxSpinnerModule,
    MapglLegendModule,
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
    })
  ],
  exports: [
    AnalyticsBoardComponent,
    AoiComponent,
    BookmarkComponent,
    BookmarkAddDialogComponent,
    BookmarkMenuComponent,
    ConfirmModalComponent,
    DatePickerComponent,
    DownloadComponent,
    DownloadDialogComponent,
    ExcludeTypePipe,
    ExtendComponent,
    FiltersComponent,
    GetTimeLabelPipe,
    LanguageSwitcherComponent,
    LinkComponent,
    SearchComponent,
    ShareComponent,
    ShareDialogComponent,
    TimelineComponent,
    TimelineShortcutComponent,
    WidgetComponent,
    HistogramWidgetComponent,
    ProgressSpinnerComponent,
    UserInfosComponent,
    ReconnectDialogComponent,
    InvalidConfigDialogComponent,
    HistogramTooltipOverlayComponent,
    DonutTooltipOverlayComponent
  ],


  declarations: [
    AnalyticsBoardComponent,
    AoiComponent,
    BookmarkComponent,
    BookmarkAddDialogComponent,
    BookmarkMenuComponent,
    ConfirmModalComponent,
    DatePickerComponent,
    DownloadComponent,
    DownloadDialogComponent,
    ExcludeTypePipe,
    ExtendComponent,
    FiltersComponent,
    GetTimeLabelPipe,
    LanguageSwitcherComponent,
    LinkComponent,
    SearchComponent,
    ShareComponent,
    ShareDialogComponent,
    TimelineComponent,
    TimelineShortcutComponent,
    WidgetComponent,
    HistogramWidgetComponent,
    ProgressSpinnerComponent,
    UserInfosComponent,
    ReconnectDialogComponent,
    InvalidConfigDialogComponent,
    HistogramTooltipOverlayComponent,
    DonutTooltipOverlayComponent
  ],
  providers: [
    FetchInterceptorService, ArlasOverlayService
  ],
  entryComponents: [
    ReconnectDialogComponent,
    InvalidConfigDialogComponent,
    ActionModalComponent,
    UserInfosComponent,
    HistogramTooltipOverlayComponent,
    DonutTooltipOverlayComponent
  ]
})
export class ArlasToolkitSharedModule { }
