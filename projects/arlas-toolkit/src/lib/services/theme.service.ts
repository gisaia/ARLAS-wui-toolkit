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

import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkMode = signal(false);
  private readonly THEME_KEY = 'dark-theme-enabled';

  public constructor() {
    // Load saved preference
    const saved = localStorage.getItem(this.THEME_KEY);
    this.darkMode.set(saved === 'true');
    if (this.darkMode()) {
      document.body.classList.add('dark-theme');
    }
  }

  /**
   * Toggle theme between dark and light mode
   * save the current choice in localstorage
   */
  public toggleThemeMode() {
    const body = document.body;

    this.darkMode.set(!this.darkMode());
    localStorage.setItem(this.THEME_KEY, this.darkMode().toString());

    if (this.darkMode()) {
      body.classList.add('dark-theme');
    } else {
      body.classList.remove('dark-theme');
    }
  }

  public isDarkMode() {
    return this.darkMode();
  }
}
