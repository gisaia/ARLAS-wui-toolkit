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
  ArlasConfigService,
  ArlasStartupService
} from '../../../../projects/arlas-toolkit/src/lib/services/startup/startup.service';
import { AuthentSetting, CollectionUnit, SpinnerOptions } from '../../../../projects/arlas-toolkit/src/lib/tools/utils';
import { AnalyticsService, ArlasOverlayService } from '../../../../projects/arlas-toolkit/src/public-api';
import { ChipsSearchContributor } from 'arlas-web-contributors';
import {
  AiasDownloadComponent,
  AnalyticsService,
  ArlasOverlayService,
  ProcessService
} from '../../../../projects/arlas-toolkit/src/public-api';
import packageJson from '../../../../package.json';
import { fromEvent, map, Observable, of } from 'rxjs';
import {
  DEFAULT_SPINNER_OPTIONS
} from '../../../../projects/arlas-toolkit/src/lib/components/progress-spinner/progress-spinner.component';
import { MatDialog } from "@angular/material/dialog";


@Component({
  selector: 'arlas-tool-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
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

  @ViewChild('tooltip') public tooltip;

  public constructor(
    private arlasStartupService: ArlasStartupService,
    private arlasConfigService: ArlasConfigService,
    private arlasIamService: ArlasIamService,
    private processService: ProcessService,
    private arlasAuthentService: ArlasAuthentificationService,
    private analyticsService: AnalyticsService,
    private arlasOverlayService: ArlasOverlayService,
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

    const chipssearchContributorConfig = this.getContributorConfig(this.CHIPSSEARCH_ID);
    if (chipssearchContributorConfig !== undefined) {
      this.searchContributor = this.arlasStartupService.contributorRegistry.get(this.CHIPSSEARCH_ID) as ChipsSearchContributor;
    }

    this.version = packageJson.version;

    this.shortcuts?.forEach((_, idx) => {
      this.isShortcutOpen.push(idx % 2 === 0);
    });

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
  }

  public logout() {
    this.arlasIamService.logout();
  }

  public onOpen(event: boolean, idx: number): void {
    if (event) {
      this.lastShortcutOpen = idx;
    }
  }

  private getContributorConfig(contributorIdentifier: string) {
    return this.arlasStartupService.emptyMode ? undefined : this.arlasConfigService.getValue('arlas.web.contributors').find(
      contrib => (contrib.identifier === contributorIdentifier)
    );
  }

  openProcess() {
    const wkt2 = 'POLYGON ((120.525513 23.397724, 120.481567 22.912863, 121.096802 23.104997, 120.855103 23.317036, 120.525513 23.397724))';
    //located in africa near chad and niger
    const wkt = 'POLYGON((10 10, 20 10, 20 20, 10 20, 10 10),(13 13, 17 13, 17 17, 13 17, 13 13))';
     this.getItemsDetail().subscribe(item => {
      const downloadDialogRef = this.dialog.open(
        AiasDownloadComponent,
        {
          minWidth: '520px',
          maxWidth: '60vw' ,
          data: {
            nbProducts: 1,
            itemDetail: item,
            wktAoi: wkt,
            ids: ['1'],
            collection: 'totot',
          }
        });
    });


  }

  public getItemsDetail(

  ): Observable<Map<string, any>> {
    // properties.main_asset_format its the field to pass to get the object value
    const fields = ['properties.proj__epsg', 'properties.main_asset_format', 'geometry'];
    const data = {
      "hits" : [{
        data : {
          'properties_proj__epsg': 32629,
          'properties_main_asset_format': 'GEOTIFF',
           geometry: {type: 'Polygon', coordinates: [
               [
                 [
                   -11.681309,
                   26.992433
                 ],
                 [
                   -11.068157,
                   26.871479
                 ],
                 [
                   -11.200577,
                   26.342324
                 ],
                 [
                   -11.810599,
                   26.463114
                 ],
                 [
                   -11.681309,
                   26.992433
                 ]
               ]
             ]}
        }
      }
      ]
    };
    const searchResult =  of(data);
    return searchResult.pipe(map((data: any) => {
      const matchingAdditionalParams = new Map<string, any>();
      if (!!data && !!data?.hits && data.hits.length > 0) {
        const regexReplacePoint = /\./gi;
        data.hits.forEach(i => {
          const itemMetadata = i.data;
          fields.forEach(f => {
            const flattenField = f.replace(regexReplacePoint, '_');
            matchingAdditionalParams.set(f, itemMetadata[flattenField]);
          });
        });
      }
      return matchingAdditionalParams;
    }));
  }

}


