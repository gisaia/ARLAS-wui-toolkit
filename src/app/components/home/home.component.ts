import { Component, OnInit } from '@angular/core';
import { TimelineConfiguration } from '../../../../projects/arlas-toolkit/src/lib/components/timeline/timeline/timeline.utils';
import { ArlasIamService } from '../../../../projects/arlas-toolkit/src/lib/services/arlas-iam/arlas-iam.service';
import {
  ArlasCollaborativesearchService, ArlasConfigService, ArlasStartupService
} from '../../../../projects/arlas-toolkit/src/lib/services/startup/startup.service';

@Component({
  selector: 'arlas-tool-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public analytics: Array<any>;
  public languages: string[];
  public analyticsOpen = false;
  public target: string;
  public timelineComponentConfig;
  public detailedTimelineComponentConfig: TimelineConfiguration;

  public constructor(
    private arlasStartupService: ArlasStartupService,
    private arlasConfigService: ArlasConfigService,
    private arlasIamService: ArlasIamService,
    private collaborativeService: ArlasCollaborativesearchService,
  ) {
    this.timelineComponentConfig = this.arlasConfigService.getValue('arlas.web.components.timeline');
  }

  public ngOnInit(): void {

    this.collaborativeService.setCollaborations({});
    this.analytics = this.arlasStartupService.analytics;
    this.languages = ['en', 'fr', 'it', 'es', 'de', 'us', 'cn'];
  }

  public logout() {
    this.arlasIamService.logout();
  }

}
