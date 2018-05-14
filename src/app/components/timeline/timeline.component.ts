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

import { Component, Input, OnInit } from '@angular/core';
import { HistogramContributor } from 'arlas-web-contributors';
import { OperationEnum } from 'arlas-web-core';
import { ArlasCollaborativesearchService } from './../../services/startup/startup.service';

@Component({
  selector: 'arlas-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {

  @Input() public detailedTimelineComponent: any;
  @Input() public timelineComponent: any;

  public showDetailedTimeline = false;
  private timelineIsFiltered = false;

  constructor(private arlasCollaborativesearchService: ArlasCollaborativesearchService) {
  }

  public ngOnInit() {
    if (this.detailedTimelineComponent) {
      this.detailedTimelineComponent.input.isHistogramSelectable = false;
      this.arlasCollaborativesearchService.collaborationBus.filter(c => (c.id === this.timelineComponent.contributorId || c.all))
      .subscribe(c => {
        if (c.operation === OperationEnum.remove) {
          this.timelineIsFiltered = false;
          this.showDetailedTimeline = false;
        } else if (c.operation === OperationEnum.add ) {
          this.timelineIsFiltered = true;
        }
      });

      this.arlasCollaborativesearchService.ongoingSubscribe.subscribe(nb => {
        if (this.arlasCollaborativesearchService.totalSubscribe === 0 && this.timelineIsFiltered) {
          const timelineRange = (<HistogramContributor>this.arlasCollaborativesearchService.registry
            .get(this.timelineComponent.contributorId)).range;
          const detailedTimelineRange = (<HistogramContributor>this.arlasCollaborativesearchService.registry
            .get(this.detailedTimelineComponent.contributorId)).range;
          this.showDetailedTimeline = (detailedTimelineRange <= 0.2 * timelineRange);
        }
      });
    }
  }

}
