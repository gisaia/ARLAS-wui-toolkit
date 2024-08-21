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

import { WidgetConfiguration } from '../../tools/utils';

export interface AnalyticGroupConfiguration {
  /**
   * @description Id of the group of widgets
   */
  groupId: string;
  /**
   * @description List of widgets within this group
   */
  components: Array<WidgetConfiguration>;
  /**
   * @description Tab identifiant this group is part of
   */
  tab: string;
  /**
   * @description Title of the group
   */
  title?: string;
  /**
   * @description Values used to filter the display of group
   */
  filterValues?: Array<string>;
  /**
   * @description icon name (from Material icons)
   */
  icon?: string;
  /**
   * @description Whether the group of Widgets is collapsed on application start.
   */
  collapsed?: boolean;
}

export interface AnalyticsTabs {
  name: string;
  icon: string;
  showName: boolean;
  showIcon: boolean;
}
