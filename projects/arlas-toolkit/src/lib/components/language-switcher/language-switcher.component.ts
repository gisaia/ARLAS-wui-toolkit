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

import { OnInit, Component, Input } from '@angular/core';
import { getParamValue } from '../../tools/utils';

/**
 * This component changes the `lg` parameter of ARLAS-wui url.
 */
@Component({
  selector: 'arlas-language-switcher',
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.scss']
})
export class LanguageSwitcherComponent implements OnInit {
  /**
   * @Input : Angular
   * @description List of available languages for translation
   */
  @Input() public availablesLanguages: string[];

  @Input() public currentLanguage: string;

  public constructor() {
  }

  public ngOnInit() {
    this.currentLanguage = navigator.language.slice(0, 2);
    const urlLanguage = getParamValue('lg');
    if (urlLanguage) {
      this.currentLanguage = decodeURIComponent(urlLanguage.replace(/\+/g, ' '));
    }
  }

  /**
   * Sets the given language in `lg` parameter of ARLAS-wui url
   * @param lang Language name
   */
  public setLanguage(lang: string) {
    let newLg: string;
    if (window.location.search) {
      if (window.location.search.indexOf('lg') !== -1) {
        newLg = window.location.search.replace(/lg=(\w+)/, 'lg=' + lang);
      } else {
        newLg = window.location.search + '&lg=' + lang;
      }
    } else {
      newLg = '?lg=' + lang;
    }
    const newUrl = window.location.host + window.location.pathname + newLg;

    window.location.replace('http://' + newUrl);
  }
}


