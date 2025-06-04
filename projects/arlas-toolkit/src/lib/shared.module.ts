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
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MarkerModule } from '@colsen1991/ngx-translate-extract-marker/extras';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { OwlMomentDateTimeModule } from '@danielmoncada/angular-datetime-picker-moment-adapter';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ArlasMapModule, } from 'arlas-map';
import {
  BaseCollectionService,
  CalendarTimelineModule,
  CollectionModule,
  ColorGeneratorLoader,
  ColorGeneratorModule,
  DonutModule,
  FormatNumberModule,
  GetCollectionDisplayModule,
  GetCollectionUnitModule,
  GetFieldDisplayModule,
  HistogramModule,
  MetricModule,
  MetricsTableModule,
  PowerbarsModule,
  ResultsModule
} from 'arlas-web-components';
import { MarkdownModule } from 'ngx-markdown';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AdmonitionCardComponent } from './components/admonition-card/admonition-card.component';
import { AiasDownloadComponent } from './components/aias/aias-download/aias-download.component';
import { AiasEnrichComponent } from './components/aias/aias-enrich/aias-enrich.component';
import { AiasResultComponent } from './components/aias/aias-result/aias-result.component';
import { AnalyticsBoardComponent } from './components/analytics/analytics-board/analytics-board.component';
import { AnalyticsMenuComponent } from './components/analytics/analytics-menu/analytics-menu.component';
import { AoiComponent } from './components/aoi/aoi.component';
import { BookmarkMenuComponent } from './components/bookmark-menu/bookmark-menu.component';
import { BookmarkAddDialogComponent } from './components/bookmark/bookmark-add-dialog.component';
import { BookmarkComponent } from './components/bookmark/bookmark.component';
import {
  CalendarTimelineTooltipOverlayComponent
} from './components/calendar-timeline-tooltip-overlay/calendar-timeline-tooltip-overlay.component';
import { CalendarTimelineToolComponent } from './components/calendar-timeline/calendar-timeline.component';
import { ActionModalModule } from './components/config-manager/action-modal/action-modal.module';
import { ConfigMenuModule } from './components/config-manager/config-menu/config-menu.module';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';
import { DeniedAccessDialogComponent } from './components/denied-access-dialog/denied-access-dialog.component';
import { DonutTooltipOverlayComponent } from './components/donut-tooltip-overlay/donut-tooltip-overlay.component';
import { DownloadComponent, DownloadDialogComponent } from './components/download/download.component';
import { ExtendComponent } from './components/extend/extend.component';
import { FilterShortcutChipComponent } from './components/filter-shortcut/chip/chip.component';
import { FilterShortcutComponent } from './components/filter-shortcut/filter-shortcut.component';
import {
  ShortcutFiltersHandlerComponent
} from './components/filter-shortcut/filters-handler/filters-handler.component';
import {
  FiltersComponent,
  GetCollaborationIconPipe,
  GetColorFilterPipe,
  GetContributorLabelPipe,
  GetGlobalColorFilterPipe,
  IsCollabOnCollectionPipe
} from './components/filters/filters.component';
import {
  HistogramTooltipOverlayComponent
} from './components/histogram-tooltip-overlay/histogram-tooltip-overlay.component';
import { HistogramWidgetComponent } from './components/histogram-widget/histogram-widget.component';
import { LanguageSwitcherComponent } from './components/language-switcher/language-switcher.component';
import {
  PermissionsCreatorDialogComponent
} from './components/permissions-creator/permissions-creator-dialog/permissions-creator-dialog.component';
import { PermissionsCreatorComponent } from './components/permissions-creator/permissions-creator.component';
import { PowerbarTooltipOverlayComponent } from './components/powerbar-tooltip-overlay/powerbar-tooltip-overlay.component';
import { ProgressSpinnerComponent } from './components/progress-spinner/progress-spinner.component';
import { ReconnectDialogComponent } from './components/reconnect-dialog/reconnect-dialog.component';
import { SearchComponent, SearchDialogComponent } from './components/search/search.component';
import { ExcludeTypePipe } from './components/share/exclude-type.pipe';
import { ShareComponent, ShareDialogComponent } from './components/share/share.component';
import { DatePickerComponent } from './components/timeline/date-picker/date-picker.component';
import { TimelineShortcutComponent } from './components/timeline/timeline-shortcut/timeline-shortcut.component';
import { TimelineComponent } from './components/timeline/timeline/timeline.component';
import { AboutComponent, AboutDialogComponent } from './components/top-menu/about/about.component';
import { LinkComponent } from './components/top-menu/links/link/link.component';
import { LinksComponent } from './components/top-menu/links/links.component';
import { TopMenuComponent } from './components/top-menu/top-menu.component';
import { UserInfosComponent } from './components/user-infos/user-infos.component';
import { WidgetComponent } from './components/widget/widget.component';
import { ContributorUpdatingPipe } from './pipes/contributor-updating.pipe';
import { GetTimeLabelPipe } from './pipes/get-time-label.pipe';
import { ArlasCollaborativesearchService } from './services/collaborative-search/arlas.collaborative-search.service';
import { ArlasCollectionService } from './services/collection/arlas-collection.service';
import { ArlasOverlayService } from './services/overlays/overlay.service';
import { ArlasConfigService, ArlasStartupService } from './services/startup/startup.service';
import { ArlasWalkthroughModule } from './services/walkthrough/walkthrough.module';
import { ArlasColorGeneratorLoader } from './tools/color-generator-loader';
import { CustomTranslateLoader } from './tools/Translation/custom-translate-loader';


@NgModule({
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
    IsCollabOnCollectionPipe,
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
    AiasDownloadComponent,
    ContributorUpdatingPipe,
    AiasEnrichComponent
  ],
  imports: [
    ActionModalModule,
    CommonModule,
    DonutModule,
    CalendarTimelineModule,
    DragDropModule,
    FormsModule,
    HistogramModule,
    MetricModule,
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
    MetricsTableModule,
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
    ArlasMapModule,
    CollectionModule.forRoot({
      loader: {
        deps: [
          ArlasCollaborativesearchService,
          ArlasConfigService,
          ArlasStartupService
        ],
        provide: BaseCollectionService,
        useClass: ArlasCollectionService
      }
    }),
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
    MarkdownModule.forRoot(),
    GetCollectionUnitModule,
    GetCollectionDisplayModule,
    GetFieldDisplayModule,
    AdmonitionCardComponent,
    MarkerModule,
    AiasResultComponent
  ],
  providers: [
    ArlasOverlayService,
    ArlasCollectionService,
    provideHttpClient(withInterceptorsFromDi())
  ]})
export class ArlasToolkitSharedModule { }
