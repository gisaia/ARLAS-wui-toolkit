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
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'arlas-filter-shortcut-chip',
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.scss']
})
export class FilterShortcutChipComponent {
  @Input() public label: string;
  @Input() public hide = false;
  @Input() public shortenValues = true;
  @Output() public clearEmitter: EventEmitter<string> = new EventEmitter();

  public clear(event: Event) {
    event.stopPropagation();
    if (!this.hide) {
      this.clearEmitter.emit(this.label.replace('≠', ''));
    }
  }

}
