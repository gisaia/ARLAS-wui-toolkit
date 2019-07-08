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

import { Component, Output } from '@angular/core';
import { ArlasAoiService } from '../../services/aoi/aoi.service';
import { Subject } from 'rxjs';
import { Aoi } from '../../services/aoi/model';
import { ArlasDataSource } from '../../tools/arlasDataSource';

@Component({
  selector: 'arlas-aoi',
  templateUrl: './aoi.component.html',
  styleUrls: ['./aoi.component.css']
})
export class AoiComponent {

  public aois: ArlasDataSource;
  public columnsToDisplay = ['checked', 'name', 'date', 'actions'];
  public itemsCheck: Array<string> = new Array<string>();

  @Output() public actions: Subject<{ action: string, id: string, geometry?: any }> = new Subject<any>();

  constructor(
    private aoiService: ArlasAoiService
  ) {
    this.aois = new ArlasDataSource(this.aoiService.dataBase);
  }

  public selectAoi(event, id) {
    if (event.checked) {
      this.itemsCheck.push(id);
    } else {
      const index = this.itemsCheck.indexOf(id, 0);
      if (index > -1) {
        this.itemsCheck.splice(index, 1);
      }
    }
  }

  public viewAoi(id: string) {
    const aoi: Aoi = this.aoiService.getAoiById(id);
    this.actions.next({ action: 'view', id: id, geometry: aoi.geometry });

  }

  public removeAoi(id: string) {
    this.aoiService.removeAoi(id);
    this.selectAoi({ event: { checked: false } }, id);
    this.actions.next({ action: 'remove', id: id });
  }
}
