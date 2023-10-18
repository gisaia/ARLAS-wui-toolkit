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
  OnInit, Output, PipeTransform, Pipe, OnChanges, SimpleChanges
} from '@angular/core';
import { Subject } from 'rxjs';
import { Contributor, Collaboration } from 'arlas-web-core';
import { CollectionReferenceParameters } from 'arlas-api';
import { ArlasCollaborativesearchService, ArlasConfigService, ArlasStartupService } from '../../services/startup/startup.service';
import { ArlasColorGeneratorLoader } from '../../services/color-generator-loader/color-generator-loader.service';
import { CollectionUnit, CollectionCount } from '../../tools/utils';
import { trigger, state, style, transition, animate } from '@angular/animations';


const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

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
  public transform(value: string, type: string, collaborationsMap: Map<string, Collaboration>): string {
    const collaboration = collaborationsMap.get(value);
    if (type === 'color') {
      return collaboration.enabled ? '#000' : '#BDBDBD';
    } else if (type === 'background') {
      return '#FFF';
    }
  }
}

@Pipe({ name: 'getGlobalColorFilter' })
export class GetGlobalColorFilterPipe implements PipeTransform {
  public transform(value: string, type: string, color, backgroundColor, collaborationsMap: Map<string, Collaboration>): string {
    const collaboration = collaborationsMap.get(value);
    if (type === 'color') {
      return collaboration.enabled ? color : '#BDBDBD';
    } else if (type === 'background') {
      return collaboration.enabled ? backgroundColor : '#FFF';
    }
  }
}

@Pipe({ name: 'getCollaborationIcon' })
export class GetCollaborationIconPipe implements PipeTransform {
  public transform(value: string, contributorsIcons: Map<string, string>): string {
    return contributorsIcons.get(value);

  }
}
@Component({
  selector: 'arlas-filter',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0 })), // Initial state when element is not present
      state('*', style({ opacity: 1 })), // Final state when element is present
      transition(':enter', animate('500ms ease-in-out')), // Animation duration and easing
      transition(':leave', animate('500ms ease-in-out'))
    ])
  ]
})
export class FiltersComponent implements OnInit, OnChanges {

  /**
   * @Input : Angular
   * @description Title to display in filter bar
   * @deprecated There is no display of the title in this component
   */
  @Input() public title = '';
  /**
   * @Input : Angular
   * @description List of collection-unit
   */
  @Input() public units: CollectionUnit[] = [];

  /**
   * @Input : Angular
   * @description Background color of the filters chips
   */
  @Input() public backgroundColorFilter = '#FFF';
  /**
    * @Input : Angular
    * @description Color of the filters icon
    */
  @Input() public colorFilter = '#000';

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
   * @Input : Angular
   * @description Map of collectionName, collection params. This input allows us to verify if the collection has a centroid path and
   * therefore propose or not the 'Zoom to Data' button
   */
  @Input() public collectionToDescription = new Map<string, CollectionReferenceParameters>();

  /**
   * @Input : Angular
   * @description Specifies which space in pixels is available to display the collection counts,
   * in order to hide the one that would overflow. If not set, this behavior is not put in place.
   */
  @Input() public availableSpace: number;

  /**
   * @Input : Angular
   * @description Width of the extra count box to use for space computation.
   * Can be subject to modifications based on the style used
   */
  @Input() public extraTitleWidth = 150;

  /**
   * @Input : Angular
   * @description Spacing used between collection count elements.
   * Used to compute how much space is available for the counts.
   */
  @Input() public spacing = 5;

  /**
   * @Output : Angular
   * @description This output emit app name on click on the title of the filter
   * @deprecated There is no display of the title in this component
   */
  @Output() public clickOnTitle: Subject<string> = new Subject<string>();

  /**
   * @Output : Angular
   * @description This output emit contributor id  on click on filter chip
   */
  @Output() public clickOnFilter: Subject<string> = new Subject<string>();

  /**
   * @Output : Angular
   * @description This output emits the order of zooming on the extent of the given collection name
   */
  @Output() public zoomEvent: Subject<string> = new Subject<string>();


  public collaborations: Set<string> = new Set<string>();
  public contributors: Map<string, Contributor>;
  public contributorsIcons: Map<string, string>;
  public collaborationByCollection: Array<{ collection: string; collaborationId: string; }> = [];
  public countAll: CollectionCount[];
  public extraCountAll: CollectionCount[];
  public NUMBER_FORMAT_CHAR = 'NUMBER_FORMAT_CHAR';
  public collaborationsMap: Map<string, Collaboration>;
  public isExtraOpen = false;

  public constructor(
    private collaborativeSearchService: ArlasCollaborativesearchService,
    private arlasStartupService: ArlasStartupService,
    private configService: ArlasConfigService,
    private arlasColorService: ArlasColorGeneratorLoader,
    private cdr: ChangeDetectorRef
  ) {

    this.contributors = this.collaborativeSearchService.registry;
    this.subscribeToFutureCollaborations();
  }

  public ngOnInit(): void {
    this.contributorsIcons = new Map(this.getAllContributorsIcons());
    if (!this.units) {
      this.units = [];
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['availableSpace'] || changes['extraTitleWidth']) {
      this.hideExtraCollections(true);
    }
  }

  public removeCollaboration(contributorId: string): void {
    this.collaborativeSearchService.removeFilter(contributorId);
    this.cdr.detectChanges();
  }

  public changeCollaborationState(contributorId): void {
    this.clickOnFilter.next(contributorId);
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

  public zoomToData(collection: string): void {
    this.zoomEvent.next(collection);
  }

  public toggleExtraCounts() {
    this.isExtraOpen = !this.isExtraOpen;
  }

  private retrieveCurrentCollaborations() {
    // If a contributor is the one of a shortcut, then its id is an UUID
    Array.from(this.contributors.keys()).filter(id => (this.ignoredContributors.indexOf(id) < 0) && !id.match(UUID_REGEX))
      .forEach(contributorId => {
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
        if (!!count) {
          this.countAll = [];
          /** respects order of units list that is given by config */
          const unitsSet = new Set(this.units.map(u => u.collection));
          const countsMap = new Map<string, CollectionCount>();
          count.forEach(c => {
            const unit = this.units.find(u => u.collection === c.collection);
            countsMap.set(c.collection, {
              collection: c.collection,
              count: c.count,
              color: this.arlasColorService.getColor(c.collection) + ' !important',
              hasCentroidPath: !!this.collectionToDescription.get(c.collection) &&
                !!this.collectionToDescription.get(c.collection).centroid_path,
              unit: !!unit ? unit.unit : c.collection,
              ignored: !!unit ? unit.ignored : false
            });
          });

          this.units.forEach(u => {
            if (countsMap.get(u.collection)) {
              this.countAll.push(countsMap.get(u.collection));
            }
          });
          countsMap.forEach((v, k) => {
            if (!unitsSet.has(k)) {
              this.countAll.push(v);
            }
          });
        }
        this.cdr.detectChanges();
        this.hideExtraCollections(false);
      });
      if (!collaborationBus.all && (this.ignoredContributors.indexOf(collaborationBus.id) < 0) && !collaborationBus.id.match(UUID_REGEX)) {
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

  /**
   * Based on the space available, decide which collection count go in a 'See more' section. If no 'availableSpace' is set, nothing is done.
   */
  private hideExtraCollections(resizeEvent: boolean) {
    if (this.availableSpace && this.countAll) {
      if (resizeEvent && this.extraCountAll) {
        this.countAll = this.countAll.concat(this.extraCountAll);
        this.cdr.detectChanges();
      }
      const widths = this.countAll.map(
        c => document.getElementById(`arlas-count-${c.collection}`).getBoundingClientRect().width + this.spacing);
      const clearAllWidth = this.collaborations.size > 0 ?
        document.getElementById('clear-all').getBoundingClientRect().width + this.spacing : 0;
      const timelineChipWidth = this.collaborations.has('timeline') ?
        document.getElementById('filter-chip-timeline').getBoundingClientRect().width + this.spacing : 0;

      let breakoffIndex = -1;
      let cumulativeWidth = 0;
      const threshold = this.availableSpace - timelineChipWidth - clearAllWidth;
      for (let idx = 0; idx < widths.length; idx++) {
        cumulativeWidth += widths[idx];
        // If this count overflows
        if (cumulativeWidth > threshold) {
          // If the previous count + the 'See more' overflows
          if (idx - 1 > 0 && cumulativeWidth - widths[idx] > threshold - this.extraTitleWidth) {
            breakoffIndex = idx - 1;
          } else {
            breakoffIndex = idx;
          }
          break;
        }
      }
      this.extraCountAll = breakoffIndex >= 0 ? this.countAll.splice(breakoffIndex, this.countAll.length - breakoffIndex) : [];
      this.cdr.detectChanges();
    }
  }
}
