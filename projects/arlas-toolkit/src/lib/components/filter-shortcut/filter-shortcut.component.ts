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

import { Component, Input, OnInit, Output } from '@angular/core';
import { FilterShortcutConfiguration } from './filter-shortcut.utils';
import { ArlasCollaborativesearchService } from '../../services/startup/startup.service';
import { OperationEnum, Contributor } from 'arlas-web-core';
import { Subject } from 'rxjs';


@Component({
  selector: 'arlas-filter-shortcut',
  templateUrl: './filter-shortcut.component.html',
  styleUrls: ['./filter-shortcut.component.css']
})
export class FilterShortcutComponent implements OnInit {

  @Input() public shortcut: FilterShortcutConfiguration;
  @Input() public openAtFirst: boolean | undefined;
  @Input() public shortcutWidth = 300;
  @Input() public shortcutHeight = 90;

  @Output() public openEvent: Subject<boolean> = new Subject();

  public inputs;
  public isOpen = false;
  public histogramUnit: string;
  public histogramDatatype: string;

  public constructor(private collaborativeSearchService: ArlasCollaborativesearchService) {

  }

  public ngOnInit(): void {
    this.isOpen = (this.openAtFirst === true);
    if (this.isOpen) {
      this.activateContributor();
    }
    this.inputs = Object.assign({}, this.shortcut.component.input);
    this.setHistogramInput();
    this.setPowerbarsInput();
  }

  public toggle() {
    this.isOpen = !this.isOpen;
    this.openEvent.next(this.isOpen);
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
      this.inputs['chartHeight'] = this.shortcutHeight;
    }
  }

  private setPowerbarsInput() {
    if (this.shortcut.component) {
      this.inputs['groupSelections'] = false;
      this.inputs['selectWithCheckbox'] = true;

    }
  }
}
