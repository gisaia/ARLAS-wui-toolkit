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
import { ChangeDetectorRef, Component, ViewEncapsulation, Input, ChangeDetectionStrategy, OnInit, Output } from '@angular/core';
import { Contributor } from 'arlas-web-core';
import { ArlasCollaborativesearchService, ArlasConfigService, ArlasStartupService } from '../../services/startup/startup.service';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'arlas-filter',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FiltersComponent implements OnInit {

  /**
   * @Input : Angular
   * @description Title to display in filter bar
   */
  @Input() public title = '';
  /**
   * @Input : Angular
   * @description Background color of the filter bar
   */
  @Input() public backgroundColor = '#000';
  /**
   * @Input : Angular
   * @description Contributors identifier array which will be ignored from the filter summary
   */
  @Input() public ignoredContributors = new Array<string>();

  /**
   * @Input : Angular
   * @description Url to a logo to display next the title
   */
  @Input() public logoUrl;

  /**
   * @Output : Angular
   * @description This output emit app name on click on the title of the filter
   */
  @Output() public clickOnTitle: Subject<string> = new Subject<string>();


  public collaborations: Set<string> = new Set<string>();
  public contributors: Map<string, Contributor> = new Map<string, Contributor>();
  public contributorsIcons = new Map<string, string>();
  public countAll;

  constructor(
    private collaborativeSearchService: ArlasCollaborativesearchService,
    private arlasStartupService: ArlasStartupService,
    private configService: ArlasConfigService,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService
  ) {

    this.contributors = this.collaborativeSearchService.registry;
    this.subscribeToFutureCollaborations();
  }

  public ngOnInit(): void {
    this.contributorsIcons = this.getAllContributorsIcons();
  }

  public removeCollaboration(contributorId: string): void {
    this.collaborativeSearchService.removeFilter(contributorId);
    this.cdr.detectChanges();
  }

  public changeCollaborationState(contributorId): void {
    const collaborationState = this.collaborativeSearchService.isEnable(contributorId);
    if (collaborationState) {
      this.collaborativeSearchService.disable(contributorId);
    } else {
      this.collaborativeSearchService.enable(contributorId);
    }
  }

  public removeAllFilters(): void {
    this.collaborativeSearchService.removeAll();
    this.clickOnTitle.next(this.title);
    this.cdr.detectChanges();
  }

  public getCollaborationIcon(contributorId): string {
    return this.contributorsIcons.get(contributorId);
  }

  public getContributorLabel(contributorId: string): string {
    let label = this.collaborativeSearchService.registry.get(contributorId).getFilterDisplayName();
    if (label !== undefined && label !== '') {
      const labelSplited = label.split('<=');
      if (labelSplited.length === 3) {
        label = labelSplited[1].trim();
      }
      return this.translate.instant(label);
    } else {
      return '';
    }

  }

  public getChipColor(contributorId: string): string {
    const collaboration = this.collaborativeSearchService.getCollaboration(contributorId);
    if (collaboration != null) {
      const collaborationState = this.collaborativeSearchService.isEnable(contributorId);
      if (collaborationState) {
        return '#FFF';
      } else {
        return '#BDBDBD';
      }
    }
  }

  public getChipBackgroundColor(contributorId: string): string {
    const collaboration = this.collaborativeSearchService.getCollaboration(contributorId);
    if (collaboration != null) {
      if (this.collaborativeSearchService.isEnable(contributorId)) {
        return this.backgroundColor;
      } else {
        return '#FFF';
      }
    }
  }

  public getAllContributorsIcons() {
    this.arlasStartupService.contributorRegistry.forEach((v, k) => {
      if (v !== undefined) {
        this.contributorsIcons.set(
          k,
          this.configService.getValue('arlas.web.contributors').find(contrib => contrib.identifier === k).icon
        );
      }
    });
    return this.contributorsIcons;
  }

  public formatWithSpace(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  private retrieveCurrentCollaborations() {
    Array.from(this.contributors.keys()).filter(id => this.ignoredContributors.indexOf(id) < 0).forEach(contributorId => {
      const collaboration = this.collaborativeSearchService.getCollaboration(contributorId);
      if (collaboration != null) {
        this.collaborations.add(contributorId);
      } else {
        this.collaborations.delete(contributorId);
      }
    });
  }

  private subscribeToFutureCollaborations() {
    this.collaborativeSearchService.collaborationBus.subscribe(collaborationBus => {
      this.collaborativeSearchService.countAll.subscribe(count => {
        this.countAll = this.formatWithSpace(count);
        this.cdr.detectChanges();
      });
      if (!collaborationBus.all && this.ignoredContributors.indexOf(collaborationBus.id) < 0) {
        const collaboration = this.collaborativeSearchService.getCollaboration(collaborationBus.id);
        if (collaboration != null) {
          if (collaborationBus.operation === 0) {
            this.collaborations.add(collaborationBus.id);
          } else if (collaborationBus.operation === 1) {
            this.collaborations.delete(collaborationBus.id);
          }
        } else {
          this.collaborations.delete(collaborationBus.id);
        }
      } else {
        this.retrieveCurrentCollaborations();
      }
    });
  }
}
