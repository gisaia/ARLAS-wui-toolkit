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

import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FilterShortcutConfiguration } from './filter-shortcut.utils';
import { ArlasCollaborativesearchService } from '../../services/startup/startup.service';
import { OperationEnum, Contributor } from 'arlas-web-core';
import { Subject } from 'rxjs';


@Component({
  selector: 'arlas-filter-shortcut',
  templateUrl: './filter-shortcut.component.html',
  styleUrls: ['./filter-shortcut.component.css']
})
export class FilterShortcutComponent implements OnInit, AfterViewInit {

  /**
   * @Input : Angular
   * @description Configuration of the shortcut to display
  */
  @Input() public shortcut: FilterShortcutConfiguration;

  /**
   * @Input : Angular
   * @description Width of the shortcut when opened
   */
  @Input() public shortcutWidth = 300;

  /**
   * @Input : Angular
   * @description Height of the chart contained in the shortcut
   */
  @Input() public chartHeight = 90;

  /**
   * @Input : Angular
   * @description Whether to display the value of the first filter.
   * If false, it will allow the user to only see the values by clicking the chip.
   */
  @Input() public displayFilterFirstValue = true;

  /**
   * @Input : Angular
   * @description Whether the shortcut is opened and displays its widget
   */
  @Input() public isOpen = false;

  /**
   * @Output : Angular
   * @description Event emitted when the shortcut is opened or closed
   */
  @Output() public isOpenChange = new EventEmitter<boolean>();

  public inputs;
  public histogramUnit: string;
  public histogramDatatype: string;
  public titleWidth: number;

  @ViewChild('title') public titleElement: ElementRef;

  public constructor(
    private collaborativeSearchService: ArlasCollaborativesearchService,
    public cdr: ChangeDetectorRef) {

  }

  public ngOnInit(): void {
    if (this.isOpen) {
      this.activateContributor();
    }
    this.inputs = Object.assign({}, this.shortcut.component.input);
    this.setHistogramInput();
    this.setPowerbarsInput();
    this.titleWidth = this.shortcutWidth;

    // Check if collaboration occurs during the lifetime of the shortcut to update title size
    this.collaborativeSearchService.collaborationBus.subscribe(c => {
      if ((c.id === this.shortcut.component.contributorId || c.id === this.shortcut.uuid || c.id === 'url')) {
        // Allows the check to be done right after the view is changed
        setTimeout(() => {
          this.titleWidth = this.titleElement.nativeElement.getBoundingClientRect().width;
        }, 0);
      }
    });
  }

  public ngAfterViewInit(): void {
    this.titleWidth = this.titleElement.nativeElement.getBoundingClientRect().width;
    this.cdr.detectChanges();
  }

  public toggle() {
    this.isOpen = !this.isOpen;
    this.isOpenChange.next(this.isOpen);
    if (this.isOpen) {
      this.triggerContributorCollaboration();
    }
  }

  private activateContributor(): Contributor {
    const contributor: Contributor = this.collaborativeSearchService.registry.get(this.shortcut.component.contributorId);
    contributor.updateData = true;
    return contributor;
  }

  private triggerContributorCollaboration() {
    const c = this.activateContributor();
    c.updateFromCollaboration({
      id: c.linkedContributorId,
      operation: OperationEnum.add,
      all: false
    });
  }

  private setHistogramInput() {
    if (this.shortcut.component) {
      this.histogramUnit = this.inputs['xUnit'];
      this.histogramDatatype = this.inputs['dataType'];
      this.inputs['showXTicks'] = false;
      this.inputs['showYTicks'] = false;
      this.inputs['showXLabels'] = false;
      this.inputs['showYLabels'] = false;
      this.inputs['chartWidth'] = this.shortcutWidth;
      this.inputs['chartHeight'] = this.chartHeight;
    }
  }

  private setPowerbarsInput() {
    if (this.shortcut.component) {
      this.inputs['groupSelections'] = false;
      this.inputs['selectWithCheckbox'] = true;

    }
  }
}
