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
import { FilterShortcutConfiguration } from './filter-shortcut.utils';
import { ArlasCollaborativesearchService, ArlasConfigService } from '../../services/startup/startup.service';
import { OperationEnum, Contributor } from 'arlas-web-core';
import { DataType } from 'arlas-web-components';


@Component({
  selector: 'arlas-filter-shortcut',
  templateUrl: './filter-shortcut.component.html',
  styleUrls: ['./filter-shortcut.component.css']
})
export class FilterShortcutComponent implements OnInit {

  @Input() public shortcut: FilterShortcutConfiguration;

  public isOpen = false;
  public labels = [];
  public histogramUnit: string;
  public histogramDatatype: string;

  public constructor(private collaborativeSearchService: ArlasCollaborativesearchService) {

  }

  public ngOnInit(): void {
    if (this.isOpen) {
      this.activateContributor();
    }
    this.setHistogramInput();
  }

  public toggle() {
    this.isOpen = !this.isOpen;
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
      this.histogramUnit = this.shortcut.component['xUnit'];
      Object.keys(this.shortcut.component).forEach(key => {
        if (key === 'dataType') {
          this.histogramDatatype = DataType[this.shortcut.component[key]];
        }
      });
    }
  }
}
