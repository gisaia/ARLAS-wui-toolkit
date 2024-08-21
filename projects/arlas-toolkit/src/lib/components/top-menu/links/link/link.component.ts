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

import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { finalize } from 'rxjs';
import { LinkSettings } from '../../../../services/startup/startup.service';
import { GET_OPTIONS } from '../../../../tools/utils';

@Component({
  selector: 'arlas-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.scss']
})
export class LinkComponent implements OnInit {

  @Input() public link: LinkSettings;
  @Output() public hidden$: EventEmitter<void> = new EventEmitter();
  @Output() public onCheck$: EventEmitter<void> = new EventEmitter();
  @Output() public onClick$: EventEmitter<void> = new EventEmitter();

  public show = false;
  public constructor(
    private http: HttpClient,
    @Inject(GET_OPTIONS) private getOptions,
  ) { }

  public ngOnInit(): void {
    const options = this.getOptions();
    if (this.link.check_url_response_type) {
      options.responseType = this.link.check_url_response_type;
    }
    this.http.get(this.link.check_url, options)
      .pipe(finalize(() => this.onCheck$.emit()))
      .subscribe({
        next: () => {
          this.show = true;
        },
        error: () => {
          this.show = false;
          this.hidden$.emit();
        }
      });
  }

  public navigateTo(url) {
    if (url) {
      window.open(url);
    }
    this.onClick$.emit();
  }
}
