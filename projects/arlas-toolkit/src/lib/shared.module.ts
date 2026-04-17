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

import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import {
  BaseCollectionService, CollectionModule, ColorGeneratorLoader, ColorGeneratorModule
} from 'arlas-web-components';
import { MarkdownModule } from 'ngx-markdown';
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
import { ActionModalComponent } from './components/config-manager/action-modal/action-modal.component';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';
import { DeniedAccessDialogComponent } from './components/denied-access-dialog/denied-access-dialog.component';
import { DownloadComponent, DownloadDialogComponent } from './components/download/download.component';
import { ExtendComponent } from './components/extend/extend.component';
import { FilterShortcutChipComponent } from './components/filter-shortcut/chip/chip.component';
import { FilterShortcutComponent } from './components/filter-shortcut/filter-shortcut.component';
import {
  ShortcutFiltersHandlerComponent
} from './components/filter-shortcut/filters-handler/filters-handler.component';
import {
  FiltersComponent
} from './components/filters/filters.component';
import { HistogramWidgetComponent } from './components/histogram-widget/histogram-widget.component';
import { LanguageSwitcherComponent } from './components/language-switcher/language-switcher.component';
import {
  PermissionsCreatorDialogComponent
} from './components/permissions-creator/permissions-creator-dialog/permissions-creator-dialog.component';
import { PermissionsCreatorComponent } from './components/permissions-creator/permissions-creator.component';
import { ProgressSpinnerComponent } from './components/progress-spinner/progress-spinner.component';
import { ReconnectDialogComponent } from './components/reconnect-dialog/reconnect-dialog.component';
import { SearchComponent, SearchDialogComponent } from './components/search/search.component';
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
import { ArlasCollaborativesearchService } from './services/collaborative-search/arlas.collaborative-search.service';
import { ArlasCollectionService } from './services/collection/arlas-collection.service';
import { ArlasOverlayService } from './services/overlays/overlay.service';
import { ArlasConfigService, ArlasStartupService } from './services/startup/startup.service';
import { ArlasWalkthroughModule } from './services/walkthrough/walkthrough.module';
import { ArlasColorGeneratorLoader } from './tools/color-generator-loader';
import { CustomTranslateLoader } from './tools/Translation/custom-translate-loader';


const exports = [
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
  ExtendComponent,
  FiltersComponent,
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
  CalendarTimelineTooltipOverlayComponent,
  WidgetComponent,
  FilterShortcutComponent,
  FilterShortcutChipComponent,
  ShortcutFiltersHandlerComponent,
  TopMenuComponent,
  AboutComponent,
  AboutDialogComponent,
  LinksComponent,
  LinkComponent,
  ActionModalComponent,
];

@NgModule({
  imports: [
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
    ...exports
  ],
  exports: exports,
  providers: [
    ArlasOverlayService,
    ArlasCollectionService,
    provideHttpClient(withInterceptorsFromDi())
  ]
})
export class ArlasToolkitSharedModule { }
