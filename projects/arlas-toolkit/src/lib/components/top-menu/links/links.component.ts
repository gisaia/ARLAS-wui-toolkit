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

import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { ArlasSettingsService } from '../../../services/settings/arlas.settings.service';
import { LinkSettings } from '../../../services/startup/startup.service';

@Component({
  selector: 'arlas-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.scss']
})
export class LinksComponent implements OnInit {

  @HostListener('click')
  public clickInside($event) {
    $event.stopPropagation();
  }

  @HostListener('document:click')
  public clickOutside() {
    this.close$.emit();
  }

  @Output() public close$: EventEmitter<void> = new EventEmitter();

  public links: LinkSettings[];
  public nbHidden = 0;
  private nbChecked = 0;
  public showSpinner = true;

  public constructor(private settingsService: ArlasSettingsService) {
    this.links = this.settingsService.getLinksSettings();
  }

  public ngOnInit(): void {
    this.showSpinner = true;
  }

  public onLinkChecked() {
    this.nbChecked++;
    this.showSpinner = !this.links || (this.nbChecked !== this.links.length);
  }

  public onLinkHidden() {
    this.nbHidden++;
  }

  public onLinkClicked() {
    this.close$.emit();
  }
}
