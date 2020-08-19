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

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PersistenceService } from '../../../services/persistence/persistence.service';
import { Config } from '../config-menu/config-menu.component';

export interface PersistenceGroup {
  name: string;
  label: string;
  reader: boolean;
  writer: boolean;
}
@Component({
  selector: 'arlas-share-config',
  templateUrl: './share-config.component.html',
  styleUrls: ['./share-config.component.css']
})
export class ShareConfigComponent implements OnInit {

  @Input() public config: Config;
  @Output() public updateEmitter: EventEmitter<[boolean, any]> = new EventEmitter();
  public groups: Array<PersistenceGroup>;

  constructor(private persistenceService: PersistenceService) {

  }
  public ngOnInit() {
    this.persistenceService.getGroupsByZone(this.config.zone).subscribe((s: any) => {
      this.groups = new Array();
      s.forEach(g => {
        const paths = g.split('/');
        const group: PersistenceGroup = {
          name: g,
          label: paths[paths.length - 1],
          reader: (new Set(this.config.readers)).has(g),
          writer: (new Set(this.config.writers)).has(g)
        };
        this.groups.push(group);
      });
    });
  }

  public updateGroups() {
    const readers = this.config.readers ? new Set<string>(this.config.readers) : new Set<string>();
    const writers = this.config.writers ? new Set<string>(this.config.writers) : new Set<string>();
    this.groups.forEach(g => {
      if (g.reader) {
        readers.add(g.name);
      } else {
        readers.delete(g.name);
      }
      if (g.writer) {
        writers.add(g.name);
      } else {
        writers.delete(g.name);
      }
    });
    this.config.readers = Array.from(readers);
    this.config.writers = Array.from(writers);
    this.persistenceService
      .update(this.config.id, this.config.value, this.config.lastUpdate, this.config.name, this.config.readers, this.config.writers)
      .subscribe(
        () => this.updateEmitter.emit([true, {}]),
        (err) => this.updateEmitter.emit([false, err])
      );
  }

  public close() {
    this.updateEmitter.emit([true, {}]);
  }

  public changeReader(changeValue, group: PersistenceGroup) {
    group.reader = changeValue.checked;
  }
  public changeWriter(changeValue, group: PersistenceGroup) {
    group.writer = changeValue.checked;
  }
}
