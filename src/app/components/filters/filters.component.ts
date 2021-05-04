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
import {
  ChangeDetectorRef, Component, ViewEncapsulation, Input, ChangeDetectionStrategy,
  OnInit, Output, PipeTransform, Pipe
} from '@angular/core';
import { Contributor, Collaboration } from 'arlas-web-core';
import { ArlasCollaborativesearchService, ArlasConfigService, ArlasStartupService } from '../../services/startup/startup.service';
import { Subject } from 'rxjs';



@Pipe({ name: 'getContributorLabel' })
export class GetContributorLabelPipe implements PipeTransform {
  public transform(value: string, registry?: Map<string, Contributor>): string {
    let label = registry.get(value).getFilterDisplayName();
    const collection = registry.get(value).collection;
    if (label !== undefined && label !== '') {
      const labelSplited = label.split('<=');
      if (labelSplited.length === 3) {
        label = labelSplited[1].trim();
      }
      return label;
    } else {
      return '';
    }
  }
}

@Pipe({ name: 'concatCollection' })
export class ConcatCollectionPipe implements PipeTransform {
  public transform(value: string, id: string, registry?: Map<string, Contributor>): string {
    const collection = registry.get(id).collection;
    return value.concat(' : ').concat(collection);

  }
}

@Pipe({ name: 'getColorFilter' })
export class GetColorFilterPipe implements PipeTransform {
  public transform(value: string, type: string, backgroundColor, collaborationsMap: Map<string, Collaboration>): string {
    const collaboration = collaborationsMap.get(value);
    if (type === 'color') {
      return collaboration.enabled ? '#FFF' : '#BDBDBD';
    } else if (type === 'background') {
      return collaboration.enabled ? backgroundColor : '#FFF';
    }
  }
}
@Pipe({ name: 'getCollaborationIcon' })
export class GetCollaborationIconPipe implements PipeTransform {
  public transform(value: string,  contributorsIcons: Map<string, string>): string {
    return contributorsIcons.get(value);

  }
}
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
   * @description The count unit
   */
  @Input() public unit = '';
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
  public contributors: Map<string, Contributor>;
  public contributorsIcons: Map<string, string>;
  public countAll;
  public NUMBER_FORMAT_CHAR = 'NUMBER_FORMAT_CHAR';
  public collaborationsMap: Map<string, Collaboration>;

  constructor(
    private collaborativeSearchService: ArlasCollaborativesearchService,
    private arlasStartupService: ArlasStartupService,
    private configService: ArlasConfigService,
    private cdr: ChangeDetectorRef
  ) {

    this.contributors = this.collaborativeSearchService.registry;
    this.subscribeToFutureCollaborations();
  }

  public ngOnInit(): void {
    this.contributorsIcons = new Map(this.getAllContributorsIcons());
    if (!this.unit) {
      this.unit = '';
    }
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

  public getAllContributorsIcons(): any {
    return Array.from(this.arlasStartupService.contributorRegistry.keys())
      .map(k => [k, this.configService.getValue('arlas.web.contributors').find(contrib => contrib.identifier === k).icon]).values();
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
      this.collaborationsMap = new Map(this.collaborativeSearchService.collaborations);
      this.collaborativeSearchService.countAll.subscribe(count => {
        this.countAll = count;
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
