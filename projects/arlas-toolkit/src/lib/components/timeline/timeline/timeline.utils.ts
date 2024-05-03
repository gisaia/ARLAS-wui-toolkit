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

export interface TimelineConfiguration {
  /**
   * @description Identifier of the contributor that serves data to the graphic component.
   */
  contributorId: string;
  /**
   * @description swimlane | histogram | donut | powerbars | resultlist
   */
  componentType?: string;
  /**
   * @description Set of inputs of a ARLAS-web-component.
   */
  input: any;
  /**
   * @description The date format of the start/end values.
   * Please refer to this [list of specifiers](https://github.com/d3/d3-time-format/blob/master/README.md#locale_format).
   */
  dateFormat?: any;
}

export interface CollectionLegend {
  collection: string;
  display_name: string;
  color: string;
  active: boolean;
  main: boolean;
}
