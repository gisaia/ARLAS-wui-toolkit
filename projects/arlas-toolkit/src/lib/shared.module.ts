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
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';
import {
  OwlDateTimeModule, OwlNativeDateTimeModule
} from '@danielmoncada/angular-datetime-picker';
import { OwlMomentDateTimeModule } from '@danielmoncada/angular-datetime-picker-moment-adapter';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import {
  ColorGeneratorLoader, ColorGeneratorModule, DonutModule, FormatNumberModule,
  HistogramModule, MapglLegendModule, MetricModule, PowerbarsModule, ResultsModule, CalendarTimelineModule, CalendarTimelineComponent
} from 'arlas-web-components';
import en from 'arlas-web-components/assets/i18n/en.json';
import fr from 'arlas-web-components/assets/i18n/fr.json';
import { NgxSpinnerModule } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { CalendarTimelineTooltipOverlayComponent } from
  './components/calendar-timeline-tooltip-overlay/calendar-timeline-tooltip-overlay.component';
import { AnalyticsBoardComponent } from './components/analytics-board/analytics-board.component';
import { AoiComponent } from './components/aoi/aoi.component';
import { BookmarkMenuComponent } from './components/bookmark-menu/bookmark-menu.component';
import { BookmarkAddDialogComponent, BookmarkComponent } from './components/bookmark/bookmark.component';
import { ActionModalComponent } from './components/config-manager/action-modal/action-modal.component';
import { ActionModalModule } from './components/config-manager/action-modal/action-modal.module';
import { ConfigMenuModule } from './components/config-manager/config-menu/config-menu.module';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';
import { DonutTooltipOverlayComponent } from './components/donut-tooltip-overlay/donut-tooltip-overlay.component';
import { DownloadComponent, DownloadDialogComponent } from './components/download/download.component';
import { ErrorModalModule } from './components/errormodal/errormodal.module';
import { ExtendComponent } from './components/extend/extend.component';
import {
  ConcatCollectionPipe, FiltersComponent, GetCollaborationIconPipe, GetColorFilterPipe,
  GetContributorLabelPipe, GetGlobalColorFilterPipe
} from './components/filters/filters.component';
import { HistogramTooltipOverlayComponent } from './components/histogram-tooltip-overlay/histogram-tooltip-overlay.component';
import { HistogramWidgetComponent } from './components/histogram-widget/histogram-widget.component';
import { InvalidConfigDialogComponent } from './components/invalid-config-dialog/invalid-config-dialog.component';
import { LanguageSwitcherComponent } from './components/language-switcher/language-switcher.component';
import { LinkComponent } from './components/link/link.component';
import { ProgressSpinnerComponent } from './components/progress-spinner/progress-spinner.component';
import { ReconnectDialogComponent } from './components/reconnect-dialog/reconnect-dialog.component';
import { SearchComponent } from './components/search/search.component';
import { ExcludeTypePipe } from './components/share/exclude-type.pipe';
import { ShareComponent, ShareDialogComponent } from './components/share/share.component';
import { DatePickerComponent } from './components/timeline/date-picker/date-picker.component';
import { TimelineShortcutComponent } from './components/timeline/timeline-shortcut/timeline-shortcut.component';
import { TimelineComponent } from './components/timeline/timeline/timeline.component';
import { UserInfosComponent } from './components/user-infos/user-infos.component';
import { WidgetComponent } from './components/widget/widget.component';
import { GetTimeLabelPipe } from './pipes/get-time-label.pipe';
import { ArlasColorGeneratorLoader } from './services/color-generator-loader/color-generator-loader.service';
import { FetchInterceptorService } from './services/interceptor/fetch-interceptor.service';
import { ArlasOverlayService } from './services/overlays/overlay.service';
import { ArlasWalkthroughModule } from './services/walkthrough/walkthrough.module';
import { CalendarTimelineToolComponent } from './components/calendar-timeline/calendar-timeline.component';
import { FilterShortcutComponent } from './components/filter-shortcut/filter-shortcut.component';
import { MatDividerModule } from '@angular/material/divider';
import { FilterShortcutChipComponent } from './components/filter-shortcut/chip/chip.component';
import { ShortcutFiltersHandlerComponent } from './components/filter-shortcut/filters-handler/filters-handler.component';
import { TopMenuComponent } from './components/top-menu/top-menu.component';
import { MarkdownModule } from 'ngx-markdown';
import { AboutComponent, AboutDialogComponent } from './components/top-menu/about/about.component';

export class CustomTranslateLoader implements TranslateLoader {

  public constructor(private http: HttpClient) { }

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
    CalendarTimelineModule,
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
    MatDividerModule,
    MatTabsModule,
    MatTooltipModule,
    MatToolbarModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    OwlMomentDateTimeModule,
    PowerbarsModule,
    ReactiveFormsModule,
    ResultsModule,
    ConfigMenuModule,
    ScrollingModule,
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
    }),
    ArlasWalkthroughModule.forRoot(),
    MarkdownModule.forRoot()
  ],
  exports: [
    AnalyticsBoardComponent,
    AoiComponent,
    BookmarkComponent,
    BookmarkAddDialogComponent,
    BookmarkMenuComponent,
    CalendarTimelineToolComponent,
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
    HistogramWidgetComponent,
    ProgressSpinnerComponent,
    UserInfosComponent,
    ReconnectDialogComponent,
    InvalidConfigDialogComponent,
    HistogramTooltipOverlayComponent,
    CalendarTimelineTooltipOverlayComponent,
    DonutTooltipOverlayComponent,
    WidgetComponent,
    FilterShortcutComponent,
    FilterShortcutChipComponent,
    ShortcutFiltersHandlerComponent,
    TopMenuComponent,
    AboutComponent,
    AboutDialogComponent
  ],


  declarations: [
    AnalyticsBoardComponent,
    AoiComponent,
    BookmarkComponent,
    BookmarkAddDialogComponent,
    BookmarkMenuComponent,
    CalendarTimelineToolComponent,
    ConfirmModalComponent,
    DatePickerComponent,
    DownloadComponent,
    DownloadDialogComponent,
    ExcludeTypePipe,
    ExtendComponent,
    FiltersComponent,
    GetTimeLabelPipe,
    GetColorFilterPipe,
    GetGlobalColorFilterPipe,
    GetCollaborationIconPipe,
    ConcatCollectionPipe,
    GetContributorLabelPipe,
    LanguageSwitcherComponent,
    LinkComponent,
    SearchComponent,
    ShareComponent,
    ShareDialogComponent,
    TimelineComponent,
    TimelineShortcutComponent,
    HistogramWidgetComponent,
    ProgressSpinnerComponent,
    UserInfosComponent,
    ReconnectDialogComponent,
    InvalidConfigDialogComponent,
    HistogramTooltipOverlayComponent,
    CalendarTimelineTooltipOverlayComponent,
    DonutTooltipOverlayComponent,
    WidgetComponent,
    FilterShortcutComponent,
    FilterShortcutChipComponent,
    ShortcutFiltersHandlerComponent,
    TopMenuComponent,
    AboutComponent,
    AboutDialogComponent
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
    CalendarTimelineTooltipOverlayComponent,
    DonutTooltipOverlayComponent
  ]
})
export class ArlasToolkitSharedModule { }
