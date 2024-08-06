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
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ChipsSearchContributor } from 'arlas-web-contributors';
import { fromEvent } from 'rxjs';
import packageJson from '../../../../package.json';
import {
  FilterShortcutConfiguration
} from '../../../../projects/arlas-toolkit/src/lib/components/filter-shortcut/filter-shortcut.utils';
import { DEFAULT_SPINNER_OPTIONS } from '../../../../projects/arlas-toolkit/src/lib/components/progress-spinner/progress-spinner.component';
import {
  TimelineConfiguration
} from '../../../../projects/arlas-toolkit/src/lib/components/timeline/timeline/timeline.utils';
import {
  ArlasAuthentificationService
} from '../../../../projects/arlas-toolkit/src/lib/services/arlas-authentification/arlas-authentification.service';
import { ArlasIamService } from '../../../../projects/arlas-toolkit/src/lib/services/arlas-iam/arlas-iam.service';
import {
  ArlasCollaborativesearchService,
  ArlasConfigService,
  ArlasStartupService
} from '../../../../projects/arlas-toolkit/src/lib/services/startup/startup.service';
import { AuthentSetting, CollectionUnit, SpinnerOptions } from '../../../../projects/arlas-toolkit/src/lib/tools/utils';
import {
  AnalyticsService, ArlasOverlayService,
  DownloadComponent, ErrorService, ProcessComponent, ProcessService, ShareComponent, TagComponent
} from '../../../../projects/arlas-toolkit/src/public-api';

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

  public searchContributor: ChipsSearchContributor;
  public CHIPSSEARCH_ID = 'chipssearch';

  public units: Array<CollectionUnit> = new Array();
  public connected = false;

  public windowWidth = window.innerWidth;
  public spinnerOptions: SpinnerOptions = DEFAULT_SPINNER_OPTIONS;

  public collections: Array<string>;
  private downloadDialogRef: MatDialogRef<ProcessComponent>;

  @ViewChild('tooltip') public tooltip;
  @ViewChild('share', { static: false }) private shareComponent: ShareComponent;
  @ViewChild('download', { static: false }) private downloadComponent: DownloadComponent;
  @ViewChild('tag', { static: false }) private tagComponent: TagComponent;

  public constructor(
    private arlasStartupService: ArlasStartupService,
    private arlasConfigService: ArlasConfigService,
    private arlasIamService: ArlasIamService,
    private arlasAuthentService: ArlasAuthentificationService,
    private analyticsService: AnalyticsService,
    private arlasOverlayService: ArlasOverlayService,
    private collaborativeService: ArlasCollaborativesearchService,
    private errorService: ErrorService,
    private dialog: MatDialog,
    private processService: ProcessService
  ) {

  }

  public ngOnInit(): void {

    this.analyticsService.initializeGroups(this.arlasStartupService.analytics);
    this.shortcuts = this.arlasStartupService.filtersShortcuts;
    this.languages = ['en', 'fr', 'it', 'es', 'de', 'us', 'cn'];
    this.timelineComponentConfig = this.arlasConfigService.getValue('arlas.web.components.timeline');
    this.detailedTimelineComponentConfig = this.arlasConfigService.getValue('arlas.web.components.detailedTimeline');

    const chipssearchContributorConfig = this.getContributorConfig(this.CHIPSSEARCH_ID);
    if (chipssearchContributorConfig !== undefined) {
      this.searchContributor = this.arlasStartupService.contributorRegistry.get(this.CHIPSSEARCH_ID) as ChipsSearchContributor;
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
        this.arlasIamService.tokenRefreshed$.subscribe({next: (data) => this.connected = !!data && !!data.user});
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
    this.arlasOverlayService.openHistogramTooltip({data: noTime}, this.tooltip, 0, 0, false);

    fromEvent(window, 'resize')
      .subscribe((event: Event) => {
        this.windowWidth = window.innerWidth;
      });
    // this.openProcess();
  }

  public logout() {
    this.arlasIamService.logout();
  }

  public onOpen(event: boolean, idx: number): void {
    if (event) {
      this.lastShortcutOpen = idx;
    }
  }

  public displayShare() {
    const layersVisibilityStatus = new Map<string, boolean>();
    layersVisibilityStatus.set('Test:arlas_vset:arlas_id:Latest images:1636380757419', true);
    layersVisibilityStatus.set('Test:arlas_vset:arlas_id:Images:1636380768019', false);
    this.shareComponent.openDialog(layersVisibilityStatus);
  }

  public displayDownload() {
    this.downloadComponent.openDialog();
  }

  public displayTag() {
    this.tagComponent.openDialog();
  }

  public displayTagManagement() {
    this.tagComponent.openManagement();
  }

  public openProcess() {
    this.processService.setOptions({});
    this.processService.load().subscribe({
      next: () => {
        const matchingAdditionalParams = new Map<string, boolean>();
        matchingAdditionalParams.set('satellite', true);
        this.downloadDialogRef = this.dialog.open(ProcessComponent, { minWidth: '520px', maxWidth: '60vw' });
        this.downloadDialogRef.componentInstance.nbProducts = 5;
        this.downloadDialogRef.componentInstance.matchingAdditionalParams = matchingAdditionalParams;
        this.downloadDialogRef.componentInstance.wktAoi = 'POLYGON ((-64.8 32.3, -65.5 18.3, -80.3 25.2, -64.8 32.3))';
        this.downloadDialogRef.componentInstance.ids = ['id1', 'id2'];
        this.downloadDialogRef.componentInstance.collection = 'demo_eo';
      }
    });
  }

  private getContributorConfig(contributorIdentifier: string) {
    return this.arlasStartupService.emptyMode ? undefined : this.arlasConfigService.getValue('arlas.web.contributors').find(
      contrib => (contrib.identifier === contributorIdentifier)
    );
  }
}
