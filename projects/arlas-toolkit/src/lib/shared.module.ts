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

import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';
import {
  OwlDateTimeModule, OwlNativeDateTimeModule
} from '@danielmoncada/angular-datetime-picker';
import { OwlMomentDateTimeModule } from '@danielmoncada/angular-datetime-picker-moment-adapter';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import {
  CalendarTimelineModule,
  ColorGeneratorLoader, ColorGeneratorModule, DonutModule, FormatNumberModule,
  HistogramModule, MapglLegendModule, MetricModule, PowerbarsModule, ResultsModule
} from 'arlas-web-components';
import en from 'arlas-web-components/assets/i18n/en.json';
import fr from 'arlas-web-components/assets/i18n/fr.json';
import es from 'arlas-web-components/assets/i18n/es.json';
import { NgxSpinnerModule } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { CalendarTimelineTooltipOverlayComponent } from
  './components/calendar-timeline-tooltip-overlay/calendar-timeline-tooltip-overlay.component';
import { AnalyticsBoardComponent } from './components/analytics/analytics-board/analytics-board.component';
import { AnalyticsMenuComponent } from './components/analytics/analytics-menu/analytics-menu.component';
import { AoiComponent } from './components/aoi/aoi.component';
import { BookmarkMenuComponent } from './components/bookmark-menu/bookmark-menu.component';
import { BookmarkComponent } from './components/bookmark/bookmark.component';
import { CalendarTimelineToolComponent } from './components/calendar-timeline/calendar-timeline.component';
import { ActionModalComponent } from './components/config-manager/action-modal/action-modal.component';
import { ActionModalModule } from './components/config-manager/action-modal/action-modal.module';
import { ConfigMenuModule } from './components/config-manager/config-menu/config-menu.module';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';
import { DonutTooltipOverlayComponent } from './components/donut-tooltip-overlay/donut-tooltip-overlay.component';
import { DownloadComponent, DownloadDialogComponent } from './components/download/download.component';
import { ExtendComponent } from './components/extend/extend.component';
import { FilterShortcutChipComponent } from './components/filter-shortcut/chip/chip.component';
import { FilterShortcutComponent } from './components/filter-shortcut/filter-shortcut.component';
import { ShortcutFiltersHandlerComponent } from './components/filter-shortcut/filters-handler/filters-handler.component';
import {
  ConcatCollectionPipe, FiltersComponent, GetCollaborationIconPipe, GetColorFilterPipe,
  GetContributorLabelPipe, GetGlobalColorFilterPipe
} from './components/filters/filters.component';
import { HistogramTooltipOverlayComponent } from './components/histogram-tooltip-overlay/histogram-tooltip-overlay.component';
import { HistogramWidgetComponent } from './components/histogram-widget/histogram-widget.component';
import { DeniedAccessDialogComponent } from './components/denied-access-dialog/denied-access-dialog.component';
import { LanguageSwitcherComponent } from './components/language-switcher/language-switcher.component';
import { ProcessComponent } from './components/process/process.component';
import { ProgressSpinnerComponent } from './components/progress-spinner/progress-spinner.component';
import { ReconnectDialogComponent } from './components/reconnect-dialog/reconnect-dialog.component';
import { SearchComponent, SearchDialogComponent } from './components/search/search.component';
import { ExcludeTypePipe } from './components/share/exclude-type.pipe';
import { ShareComponent, ShareDialogComponent } from './components/share/share.component';
import { DatePickerComponent } from './components/timeline/date-picker/date-picker.component';
import { TimelineShortcutComponent } from './components/timeline/timeline-shortcut/timeline-shortcut.component';
import { TimelineComponent } from './components/timeline/timeline/timeline.component';
import { UserInfosComponent } from './components/user-infos/user-infos.component';
import { WidgetComponent } from './components/widget/widget.component';
import { GetTimeLabelPipe } from './pipes/get-time-label.pipe';
import { ArlasOverlayService } from './services/overlays/overlay.service';
import { ArlasWalkthroughModule } from './services/walkthrough/walkthrough.module';
import { MarkdownModule } from 'ngx-markdown';
import { AboutComponent, AboutDialogComponent } from './components/top-menu/about/about.component';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { ArlasCollaborativesearchService, ArlasConfigService } from './services/startup/startup.service';
import { PermissionsCreatorComponent } from './components/permissions-creator/permissions-creator.component';
import { PermissionsCreatorDialogComponent } from
  './components/permissions-creator/permissions-creator-dialog/permissions-creator-dialog.component';
import { ArlasColorGeneratorLoader } from './tools/color-generator-loader';
import { TopMenuComponent } from './components/top-menu/top-menu.component';
import { LinksComponent } from './components/top-menu/links/links.component';
import { LinkComponent } from './components/top-menu/links/link/link.component';
import { BookmarkAddDialogComponent } from './components/bookmark/bookmark-add-dialog.component';
import { ContributorUpdatingPipe } from './pipes/contributor-updating.pipe';

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
          } else if (lang === 'es') {
            merged = { ...es, ...res };
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
    MatMenuModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    OwlMomentDateTimeModule,
    PowerbarsModule,
    ReactiveFormsModule,
    ResultsModule,
    ConfigMenuModule,
    ScrollingModule,
    FormatNumberModule,
    NgxSpinnerModule,
    MapglLegendModule,
    ColorGeneratorModule.forRoot({
      loader: {
        provide: ColorGeneratorLoader,
        useClass: ArlasColorGeneratorLoader,
        deps: [ArlasConfigService, ArlasCollaborativesearchService]
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
    AnalyticsMenuComponent,
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
    PermissionsCreatorComponent,
    PermissionsCreatorDialogComponent,
    SearchComponent,
    SearchDialogComponent,
    ShareComponent,
    ShareDialogComponent,
    TimelineComponent,
    TimelineShortcutComponent,
    HistogramWidgetComponent,
    ProgressSpinnerComponent,
    UserInfosComponent,
    ReconnectDialogComponent,
    DeniedAccessDialogComponent,
    HistogramTooltipOverlayComponent,
    CalendarTimelineTooltipOverlayComponent,
    DonutTooltipOverlayComponent,
    WidgetComponent,
    FilterShortcutComponent,
    FilterShortcutChipComponent,
    ShortcutFiltersHandlerComponent,
    TopMenuComponent,
    AboutComponent,
    AboutDialogComponent,
    LinksComponent,
    LinkComponent
  ],
  declarations: [
    AnalyticsBoardComponent,
    AnalyticsMenuComponent,
    AoiComponent,
    LinksComponent,
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
    LinkComponent,
    LanguageSwitcherComponent,
    LinkComponent,
    PermissionsCreatorComponent,
    PermissionsCreatorDialogComponent,
    SearchComponent,
    SearchDialogComponent,
    ShareComponent,
    ShareDialogComponent,
    TimelineComponent,
    TimelineShortcutComponent,
    HistogramWidgetComponent,
    ProgressSpinnerComponent,
    UserInfosComponent,
    ReconnectDialogComponent,
    DeniedAccessDialogComponent,
    HistogramTooltipOverlayComponent,
    CalendarTimelineTooltipOverlayComponent,
    DonutTooltipOverlayComponent,
    WidgetComponent,
    FilterShortcutComponent,
    FilterShortcutChipComponent,
    ShortcutFiltersHandlerComponent,
    TopMenuComponent,
    AboutComponent,
    AboutDialogComponent,
    ProcessComponent,
    ContributorUpdatingPipe
  ],
  providers: [
    ArlasOverlayService
  ],
  entryComponents: [
    ReconnectDialogComponent,
    DeniedAccessDialogComponent,
    ActionModalComponent,
    UserInfosComponent,
    HistogramTooltipOverlayComponent,
    CalendarTimelineTooltipOverlayComponent,
    DonutTooltipOverlayComponent
  ]
})
export class ArlasToolkitSharedModule { }
