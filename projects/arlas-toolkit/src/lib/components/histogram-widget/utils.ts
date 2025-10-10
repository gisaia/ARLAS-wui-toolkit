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

import { isShortcutID } from '../filter-shortcut/filter-shortcut.utils';

/**
 * For a Swimlane or Histogram chart, computes the x and y offset at which to display the tooltip
 * @param chartWidth Width of the chart
 * @param groupLength Number of widgets in the chart's group
 * @param position Position of the chart in the group
 * @param contributorId Id of its contributor
 * @param detailed Whether the tooltip is for the detailed version of the chart (histogram only)
 */
export function computeChartTooltipOffset(chartWidth: number, groupLength: number, position: number, contributorId: string, detailed?: boolean) {
  let yOffset = 20;
  if (detailed) {
    yOffset = 20;
  }
  const analyticsBoardWidth = 445;
  let itemPerLine = 1;
  let xOffset = 470;
  if (chartWidth === Math.ceil(analyticsBoardWidth / 2) - 6 ||
      chartWidth === Math.ceil(analyticsBoardWidth / 2) - 12) {
    itemPerLine = 2;
    if (position % itemPerLine === 1) {
      xOffset = 240;
    }
  } else if (chartWidth === Math.ceil(analyticsBoardWidth / 3) - 6 ||
      chartWidth === Math.ceil(analyticsBoardWidth / 3) - 12) {
    itemPerLine = 3;
    if (position % itemPerLine === 1) {
      xOffset = 320;
      if (position === groupLength - 1) {
        xOffset = 245;
      }
    } else if (position % itemPerLine === 2) {
      xOffset = 170;
    }
  } else if (isShortcutID(contributorId)) {
    xOffset = 20;
    yOffset = 120;
  }

  return { xOffset, yOffset };
}
