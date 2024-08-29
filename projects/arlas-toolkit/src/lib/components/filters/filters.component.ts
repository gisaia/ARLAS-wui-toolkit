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
import { animate, state, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges,
  OnInit, Output, Pipe, PipeTransform, SimpleChanges, ViewEncapsulation
} from '@angular/core';
import { CollectionReferenceParameters } from 'arlas-api';
import { ArlasColorService } from 'arlas-web-components';
import { Collaboration, Contributor } from 'arlas-web-core';
import { Subject, take, takeUntil } from 'rxjs';
import { ArlasCollectionService } from '../../services/collection/arlas-collection.service';
import { ArlasCollaborativesearchService, ArlasConfigService, ArlasStartupService } from '../../services/startup/startup.service';
import { CollectionCount, ZoomToDataStrategy } from '../../tools/utils';
import { isShortcutID } from '../filter-shortcut/filter-shortcut.utils';

@Pipe({ name: 'getContributorLabel' })
export class GetContributorLabelPipe implements PipeTransform {
  public transform(value: string, registry?: Map<string, Contributor>): string {
    let label = registry.get(value).getFilterDisplayName();
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
   * @description Spacing used between collection count elements.
   * Used to compute how much space is available for the counts.
   */
  @Input() public spacing = 5;

  /**
   * @Input : Angular
   * @description Whether the zoom to data icon is displayed or not
   */
  @Input() public showZoomToData = true;

  /**
   * @Input : Angular
   * @description Type of zoom to data
   */
  @Input() public zoomToStrategy: ZoomToDataStrategy;

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
  public readonly NUMBER_FORMAT_CHAR = 'NUMBER_FORMAT_CHAR';
  public collaborationsMap: Map<string, Collaboration>;
  public isExtraOpen = false;

  public ZoomToDataStrategy = ZoomToDataStrategy;

  /**
   * @description Whether to exceptionally display the extra collections for space computations
   */
  public showExtraCollections = false;

  private _onDestroy$ = new Subject<boolean>();

  public constructor(
    private collaborativeSearchService: ArlasCollaborativesearchService,
    private arlasStartupService: ArlasStartupService,
    private configService: ArlasConfigService,
    private arlasColorService: ArlasColorService,
    private cdr: ChangeDetectorRef,
    private collectionService: ArlasCollectionService
  ) {
    this.contributors = this.collaborativeSearchService.registry;
    this.subscribeToFutureCollaborations();
  }

  public ngOnInit(): void {
    this.contributorsIcons = new Map(this.getAllContributorsIcons());
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['availableSpace'] || changes['extraTitleWidth']) {
      this.hideExtraCollections(true);
    }
  }

  public ngOnDestroy() {
    this._onDestroy$.next(true);
    this._onDestroy$.complete();
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
    Array.from(this.contributors.keys()).filter(id => (this.ignoredContributors.indexOf(id) < 0) && !isShortcutID(id))
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
    this.collaborativeSearchService.collaborationBus.pipe(takeUntil(this._onDestroy$)).subscribe(collaborationBus => {
      this.collaborationsMap = new Map(this.collaborativeSearchService.collaborations);
      this.collaborativeSearchService.countAll.pipe(take(1), takeUntil(this._onDestroy$)).subscribe(count => {
        if (!!count) {
          this.countAll = [];
          const countsMap = new Map<string, CollectionCount>();
          count.forEach(c => {
            countsMap.set(c.collection, {
              collection: c.collection,
              count: c.count,
              color: this.arlasColorService.getColor(c.collection) + ' !important',
              hasCentroidPath: !!this.collectionToDescription.get(c.collection) &&
                !!this.collectionToDescription.get(c.collection).centroid_path,
              hasGeometryPath: !!this.collectionToDescription.get(c.collection) &&
                !!this.collectionToDescription.get(c.collection).geometry_path,
              unit: this.collectionService.getUnit(c.collection),
              ignored: this.collectionService.isUnitIgnored(c.collection)
            });
          });

          /** respects order of units list that is given by config */
          const unitsSet = new Set(this.collectionService.getAllUnits().map(u => u.collection));
          unitsSet.forEach(c => {
            if (countsMap.get(c)) {
              this.countAll.push(countsMap.get(c));
            }
          });
          // Collections that don't have units are at the end of the list
          countsMap.forEach((v, k) => {
            if (!unitsSet.has(k)) {
              this.countAll.push(v);
            }
          });
        }
        this.cdr.detectChanges();
        this.hideExtraCollections(false);
      });
      if (!collaborationBus.all && (this.ignoredContributors.indexOf(collaborationBus.id) < 0) && !isShortcutID(collaborationBus.id)) {
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
      this.showExtraCollections = true;
      if (resizeEvent && this.extraCountAll) {
        this.countAll = [...this.countAll, ...this.extraCountAll];
        this.extraCountAll = new Array();
      }
      this.cdr.detectChanges();

      const widths = this.countAll.map(
        c => !!document.getElementById(`arlas-count-${c.collection}`) ?
          document.getElementById(`arlas-count-${c.collection}`).getBoundingClientRect().width + this.spacing : 0);
      const clearAllWidth = this.collaborations.size > 0 && !!document.getElementById('clear-all') ?
        document.getElementById('clear-all').getBoundingClientRect().width + this.spacing : 0;
      const timelineChipWidth = this.collaborations.has('timeline') && !!document.getElementById('filter-chip-timeline') ?
        document.getElementById('filter-chip-timeline').getBoundingClientRect().width + this.spacing : 0;
      const extraCollectionsWidth = !!document.getElementById('extra-collections') ?
        document.getElementById('extra-collections').getBoundingClientRect().width + this.spacing : 0;

      let breakoffIndex = -1;
      let cumulativeWidth = 0;
      const threshold = this.availableSpace - timelineChipWidth - clearAllWidth;
      for (let idx = 0; idx < widths.length; idx++) {
        cumulativeWidth += widths[idx];
        // If this count overflows
        if (cumulativeWidth > threshold) {
          // If the previous count + the 'See more' overflows
          if (idx - 1 >= 0 && cumulativeWidth - widths[idx] > threshold - extraCollectionsWidth) {
            breakoffIndex = idx - 1;
          } else {
            breakoffIndex = idx;
          }
          break;
        }
      }
      this.extraCountAll = breakoffIndex >= 0 ? this.countAll.splice(breakoffIndex, this.countAll.length - breakoffIndex) : [];
      this.showExtraCollections = false;
      this.cdr.detectChanges();
    }
  }
}
