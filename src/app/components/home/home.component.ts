import { Component, OnInit, ViewChild } from '@angular/core';
import { FilterShortcutConfiguration } from '../../../../projects/arlas-toolkit/src/lib/components/filter-shortcut/filter-shortcut.utils';
import { TimelineConfiguration } from '../../../../projects/arlas-toolkit/src/lib/components/timeline/timeline/timeline.utils';
import {
  ArlasAuthentificationService
} from '../../../../projects/arlas-toolkit/src/lib/services/arlas-authentification/arlas-authentification.service';
import { ArlasIamService } from '../../../../projects/arlas-toolkit/src/lib/services/arlas-iam/arlas-iam.service';
import {
  ArlasCollaborativesearchService, ArlasConfigService, ArlasStartupService
} from '../../../../projects/arlas-toolkit/src/lib/services/startup/startup.service';
import { AuthentSetting, CollectionUnit, SpinnerOptions } from '../../../../projects/arlas-toolkit/src/lib/tools/utils';
import { ChipsSearchContributor } from 'arlas-web-contributors';
import { AnalyticsService, ArlasOverlayService } from '../../../../projects/arlas-toolkit/src/public-api';
import packageJson from '../../../../package.json';
import { fromEvent } from 'rxjs';
import { DEFAULT_SPINNER_OPTIONS } from '../../../../projects/arlas-toolkit/src/lib/components/progress-spinner/progress-spinner.component';


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

  @ViewChild('tooltip') tooltip

  public constructor(
    private arlasStartupService: ArlasStartupService,
    private arlasConfigService: ArlasConfigService,
    private arlasIamService: ArlasIamService,
    private arlasAuthentService: ArlasAuthentificationService,
    private analyticsService: AnalyticsService,
    private arlasOverlayService: ArlasOverlayService
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
       'xValue': '3 600',
       'xRange': {
         'value': 600,
         'unit': 'interval (600)'
       },
       'dataType': 'numeric',
       'y': [
         {
           'value': '109 588',
           'chartId': 'demo_flickr',
           'color': '#e2c922'
         }
       ],
       'shown': true,
       'xPosition': 107.0312385559082,
       'yPosition': 72.58331298828125,
       'chartWidth': 445,
       'title': 'Height',
       'xLabel': 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit',
       'yLabel': 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit',
       'xUnit': 'voiture',
       'yUnit': 'velo'
     };
    const time = {
      'xValue': '25 December 2016',
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
    this.arlasOverlayService.openHistogramTooltip({ data: noTime }, this.tooltip, 0, 0, false);

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
}
