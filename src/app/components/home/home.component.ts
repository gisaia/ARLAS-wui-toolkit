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

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SearchContributor } from 'arlas-web-contributors';
import { fromEvent } from 'rxjs';
import packageJson from '../../../../package.json';
import { AiasDownloadComponent } from '../../../../projects/arlas-toolkit/src/lib/components/aias-download/aias-download.component';
import {
  FilterShortcutConfiguration
} from '../../../../projects/arlas-toolkit/src/lib/components/filter-shortcut/filter-shortcut.utils';
import {
  DEFAULT_SPINNER_OPTIONS
} from '../../../../projects/arlas-toolkit/src/lib/components/progress-spinner/progress-spinner.component';
import {
  TimelineConfiguration
} from '../../../../projects/arlas-toolkit/src/lib/components/timeline/timeline/timeline.utils';
import { AnalyticsService } from '../../../../projects/arlas-toolkit/src/lib/services/analytics/analytics.service';
import {
  ArlasAuthentificationService
} from '../../../../projects/arlas-toolkit/src/lib/services/arlas-authentification/arlas-authentification.service';
import { ArlasIamService } from '../../../../projects/arlas-toolkit/src/lib/services/arlas-iam/arlas-iam.service';
import { ProcessService } from '../../../../projects/arlas-toolkit/src/lib/services/process/process.service';
import {
  ArlasCollaborativesearchService,
  ArlasConfigService,
  ArlasStartupService
} from '../../../../projects/arlas-toolkit/src/lib/services/startup/startup.service';
import {
  AuthentSetting,
  ConfigAction,
  SpinnerOptions
} from '../../../../projects/arlas-toolkit/src/lib/tools/utils';
import { DownloadComponent } from '../../../../projects/arlas-toolkit/src/lib/components/download/download.component';
import { ShareComponent } from '../../../../projects/arlas-toolkit/src/lib/components/share/share.component';

@Component({
  selector: 'arlas-tool-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public shortcuts: Array<FilterShortcutConfiguration>;
  public languages: string[];
  public analyticsOpen = false;
  public target: string;
  public timelineComponentConfig: TimelineConfiguration;
  public detailedTimelineComponentConfig: TimelineConfiguration;

  public lastShortcutOpen: number;
  public isShortcutOpen: Array<boolean> = new Array();

  public version: string;

  public searchContributors: SearchContributor[];

  public connected = false;

  public windowWidth = window.innerWidth;
  public spinnerOptions: SpinnerOptions = DEFAULT_SPINNER_OPTIONS;

  public collections: Array<string>;

  public actions = new Array<ConfigAction>();

  @ViewChild('tooltip') public tooltip;
  @ViewChild('download', { static: false }) private downloadComponent: DownloadComponent;
  @ViewChild('share', { static: false }) private shareComponent: ShareComponent;

  public constructor(
    private arlasStartupService: ArlasStartupService,
    private arlasConfigService: ArlasConfigService,
    private arlasIamService: ArlasIamService,
    private processService: ProcessService,
    private arlasAuthentService: ArlasAuthentificationService,
    private analyticsService: AnalyticsService,
    private collaborativeService: ArlasCollaborativesearchService,
    private dialog: MatDialog
  ) {

  }

  public ngOnInit(): void {
    this.processService.setOptions({});
    this.processService.load().subscribe();
    this.analyticsService.initializeGroups(this.arlasStartupService.analytics);
    this.shortcuts = this.arlasStartupService.filtersShortcuts;
    this.languages = ['en', 'fr', 'it', 'es', 'de', 'us', 'cn'];
    this.timelineComponentConfig = this.arlasConfigService.getValue('arlas.web.components.timeline');
    this.detailedTimelineComponentConfig = this.arlasConfigService.getValue('arlas.web.components.detailedTimeline');

    const chipssearchContributorConfigs = this.getSearchContributorConfig();
    if (chipssearchContributorConfigs !== undefined && chipssearchContributorConfigs.length > 0) {
      this.searchContributors = chipssearchContributorConfigs
        .map(c => this.arlasStartupService.contributorRegistry.get(c.identifier) as SearchContributor);
    }

    this.version = packageJson.version;

    this.shortcuts?.forEach((_, idx) => {
      this.isShortcutOpen.push(idx % 2 === 0);
    });
    this.collections = [...new Set(Array.from(this.collaborativeService.registry.values()).map(c => c.collection))];

    const authConfig: AuthentSetting = this.arlasAuthentService.authConfigValue;
    if (!!authConfig && authConfig.use_authent) {
      if (authConfig.auth_mode === 'iam') {
        // IAM
        this.arlasIamService.tokenRefreshed$.subscribe({ next: (data) => this.connected = !!data && !!data.user });
      } else {
        // AUTH 0
      }
    }

    /**
     * to test tooltip
     */
    const noTime = {
      'xValue': '2.2',
      'xStartValue': '2.2',
      'xEndValue': '2.4',
      'xRange': {
        'value': 0.2
      },
      'dataType': 'numeric',
      'y': [
        {
          'value': '1',
          'chartId': 'demo_sea_phys_bcg',
          'color': '#19e3ff'
        }
      ],
      'shown': true,
      'xPosition': 64,
      'yPosition': 30,
      'chartWidth': 217,
      'title': 'sqxqsxsq',
      'xLabel': '',
      'yLabel': 'qxqsxqs',
      'xUnit': '',
      'yUnit': 'Marine observations'
    };
    const time = {
      'xValue': '25 December 2016',
      'xStartValue': '25 December 2016',
      'xEndValue': '25 February 2016',
      'xRange': {
        'value': 60,
        'unit': 'days (~ 2 months)'
      },
      'dataType': 'time',
      'y': [
        {
          'value': '7 538',
          'chartId': 'demo_algoe',
          'color': '#c12e45'
        }
      ],
      'shown': true,
      'xPosition': 849.0138549804688,
      'yPosition': 80.01388549804688,
      'chartWidth': 2101,
      'title': 'Timeline',
      'xLabel': 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit',
      'yLabel': 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit',
      'xUnit': 'voiture',
      'yUnit': 'velo'
    };
    // this.arlasOverlayService.openHistogramTooltip({data: noTime}, this.tooltip, 0, 0, false);

    fromEvent(window, 'resize')
      .subscribe((event: Event) => {
        this.windowWidth = window.innerWidth;
      });
  }

  public logout() {
    this.arlasIamService.logout();
  }

  public onOpen(event: boolean, idx: number): void {
    if (event) {
      this.lastShortcutOpen = idx;
    }
  }

  public displayDownload() {
    this.downloadComponent.openDialog();
  }

  public displayShare() {
    this.shareComponent.openDialog();
  }

  private getSearchContributorConfig() {
    return this.arlasStartupService.emptyMode ? undefined : this.arlasConfigService.getValue('arlas.web.contributors').filter(
      contrib => (contrib.type === 'search' || contrib.type === 'chipssearch')
    );
  }

  public openProcess() {
    const wkt = 'POLYGON((10 10, 20 10, 20 20, 10 20, 10 10),(13 13, 17 13, 17 17, 13 17, 13 13))';
    // can be used to mock your data
    const item = null;
    const downloadDialogRef = this.dialog.open(
      AiasDownloadComponent,
      {
        minWidth: '520px',
        maxWidth: '60vw',
        data: {
          nbProducts: 1,
          itemDetail: item,
          wktAoi: wkt,
          ids: ['1'],
          collection: 'totot'
        }
      });
  }

}


