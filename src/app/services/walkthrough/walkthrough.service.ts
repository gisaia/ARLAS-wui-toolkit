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
 *
 * Hopscotch is used under Apache License 2.0 : https://github.com/linkedin/hopscotch/blob/master/LICENSE
 *
 */

import { Injectable } from '@angular/core';
import hopscotch from 'hopscotch';
import {  WalkthroughLoader } from './walkthrough.utils';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class ArlasWalkthroughService {

  public hopscotch: any;
  public tourData: any;
  public isActivable = true;

  constructor(
    private walkthrougLoader: WalkthroughLoader,
    private translateService: TranslateService

  ) {
    this.hopscotch = hopscotch;
    this.load();
  }

  public load(): void {
    this.walkthrougLoader.loader()
      .then(response => {
        this.tourData = response;
        if (!this.tourData.steps || this.tourData.steps.length <= 0) {
          this.isActivable = false;
        } else {
          if (this.tourData.onStart) {
            this.tourData.onStart = new Function(this.tourData.onStart).bind(this);
          }
          if (this.tourData.onEnd) {
            this.tourData.onEnd = new Function(this.tourData.onEnd).bind(this);
          }
          if (this.tourData.onStart) {
            this.tourData.onClose = new Function(this.tourData.onClose).bind(this);
          }
          this.tourData.steps.forEach(step => {
            if (step.onNext) {
              step.onNext = new Function(step.onNext).bind(this);
            }
            if (step.onPrev) {
              step.onPrev = new Function(step.onPrev).bind(this);
            }
            if (step.onShow) {
              step.onShow = new Function(step.onShow).bind(this);
            }
          });
          this.tourData.showPrevButton = true;
          this.tourData.i18n = {
            nextBtn: this.translateService.instant('tour.nextBtn'),
            prevBtn: this.translateService.instant('tour.prevBtn'),
            doneBtn: this.translateService.instant('tour.doneBtn'),
            skipBtn: this.translateService.instant('tour.skipBtn'),
            closeTooltip: this.translateService.instant('tour.closeTooltip')
          };
          this.startTour();
        }
      })
      .catch(error => {
        console.log(error);
        this.isActivable = false;
      });
  }

  /**
   *
   * @param tour
   */
  public setTour(tour: { id: string, steps: any[] }) {
    this.tourData = tour;
  }

  /**
   * Actually starts the tour.
   * @param stepNum Optional : specifies what step to start at
   */
  public startTour(stepNum?: number) {
    if (localStorage.getItem(this.tourData.id) !== 'end') {
      if (!localStorage.getItem(this.tourData.id)) {
        this.hopscotch.startTour(this.tourData);
      } else if (stepNum) {
        this.hopscotch.startTour(this.tourData, stepNum);
        localStorage.setItem(this.tourData.id, stepNum.toString());
      } else {
        this.hopscotch.startTour(this.tourData, localStorage.getItem(this.tourData.id));
      }
      this.hopscotch.listen('next', () => {
        localStorage.setItem(this.tourData.id, this.hopscotch.getCurrStepNum());
      });
      this.hopscotch.listen('end', () => {
        localStorage.setItem(this.tourData.id, 'end');
        this.hopscotch.removeCallbacks();
      });
      this.hopscotch.listen('close', () => {
        localStorage.setItem(this.tourData.id, 'end');
        this.hopscotch.removeCallbacks();
      });
    }
  }

  /**
   * Skips to a given step in the tour
   * @param index
   */
  public showStep(index) {
    this.hopscotch.showStep(index);
  }

  /**
   * Goes back one step in the tour
   */
  public prevStep() {
    this.hopscotch.prevStep();
  }

  /**
   * Goes forward one step in the tour
   */
  public nextStep() {
    this.hopscotch.nextStep();
  }

  /**
   * Ends the current tour.
   * If clearCookie is set to false, the tour state is preserved.
   * Otherwise, if clearCookie is set to true or is not provided, the tour state is cleared
   * @param clearCookie
   */
  public endTour(clearCookie?: boolean) {
    this.hopscotch.endTour(clearCookie);
  }

  /**
   * Sets options for running the tour
   * @param options : see https://linkedin.github.io/hopscotch/#setting-tour-options
   */
  public configure(options: any) {
    this.hopscotch.configure(options);
  }

  /**
   * Returns the currently running tour
   */
  public getCurrTour() {
    return this.hopscotch.getCurrTour();
  }

  /**
   * Returns the current zero-based step number
   */
  public getCurrStepNum() {
    return this.hopscotch.getCurrStepNum();
  }

  /**
   * Adds a callback for one of the event types.
   * @param eventName Valid event types are: *start*, *end*, *next*, *prev*, *show*, *close*, *error*
   * @param callback
   */
  public listen(eventName: string, callback: () => void) {
    this.hopscotch.listen(eventName, callback);
  }

  /**
   * Removes a callback for one of the event types
   */
  public unlisten(eventName: string, callback: () => void) {
    hopscotch.unlisten(eventName, callback);
  }

  /**
   * Remove all callbacks for hopscotch events
   */
  public removeCallbacks() {
    hopscotch.removeCallbacks();
  }

  /**
   * Clear localStorage for the given tour
   * @param tour
   */
  public resetTour() {
    localStorage.removeItem(this.tourData.id);
  }
}
