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

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { XBucket } from 'arlas-d3';


/**
 * This service is a notifier of events occuring on a widget, so that any other component can intercept it and consume it if needed
 * for its own behaviour.
 */

@Injectable({
  providedIn: 'root',
})
export class WidgetNotifierService {

  private readonly hoveredBucketSource = new Subject<XBucket>();
  public hoveredBucket$ = this.hoveredBucketSource.asObservable();

  /**
   * Notifies the event of hovering a histogram bucket.
   * @param b The hovered x-bucket on the histogram.
   */
  public notifyBucketHover(b: XBucket): void {
    this.hoveredBucketSource.next(b);
  }

}
