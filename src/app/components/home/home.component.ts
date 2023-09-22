import { Component, OnInit } from '@angular/core';
import { FilterShortcutConfiguration } from '../../../../projects/arlas-toolkit/src/lib/components/filter-shortcut/filter-shortcut.utils';
import { TimelineConfiguration } from '../../../../projects/arlas-toolkit/src/lib/components/timeline/timeline/timeline.utils';
import {
  ArlasAuthentificationService
} from '../../../../projects/arlas-toolkit/src/lib/services/arlas-authentification/arlas-authentification.service';
import { ArlasIamService } from '../../../../projects/arlas-toolkit/src/lib/services/arlas-iam/arlas-iam.service';
import {
  ArlasCollaborativesearchService, ArlasConfigService, ArlasStartupService
} from '../../../../projects/arlas-toolkit/src/lib/services/startup/startup.service';
import { AuthentSetting } from '../../../../projects/arlas-toolkit/src/lib/tools/utils';


@Component({
  selector: 'arlas-tool-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public analytics: Array<any>;
  public shortcuts: Array<FilterShortcutConfiguration>;
  public languages: string[];
  public analyticsOpen = false;
  public target: string;
  public timelineComponentConfig;
  public detailedTimelineComponentConfig: TimelineConfiguration;

  public connected = false;
  public lastShortcutOpen: number;

  public constructor(
    private arlasStartupService: ArlasStartupService,
    private arlasConfigService: ArlasConfigService,
    private arlasIamService: ArlasIamService,
    private collaborativeService: ArlasCollaborativesearchService,
    private arlasAuthentService: ArlasAuthentificationService
  ) {
    this.analytics = this.arlasStartupService.analytics;
    this.shortcuts = this.arlasStartupService.filtersShortcuts;
    this.languages = ['en', 'fr', 'it', 'es', 'de', 'us', 'cn'];
    this.timelineComponentConfig = this.arlasConfigService.getValue('arlas.web.components.timeline');
    this.detailedTimelineComponentConfig = this.arlasConfigService.getValue('arlas.web.components.detailedTimeline');
  }

  public ngOnInit(): void {

    this.collaborativeService.setCollaborations({});
    this.analytics = this.arlasStartupService.analytics;
    this.languages = ['en', 'fr', 'it', 'es', 'de', 'us', 'cn'];

    const authConfig: AuthentSetting = this.arlasAuthentService.authConfigValue;
    if (!!authConfig && authConfig.use_authent) {
      if (authConfig.auth_mode === 'iam') {
        // IAM
        this.arlasIamService.tokenRefreshed$.subscribe({ next: (data) => this.connected = !!data && !!data.user });
      } else {
        // AUTH 0
      }
    }
  }

  public logout() {
    this.arlasIamService.logout();
  }

  public onOpen(event: boolean, idx: number): void {
    if (event) {
      this.lastShortcutOpen = idx;
    }
  }
}
