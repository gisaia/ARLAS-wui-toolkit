import { Component, Input, OnInit } from '@angular/core';
import { AnalyticGroupConfiguration } from '../analytics.utils';
import { AnalyticsService } from '../../../services/analytics/analytics.service';
import { getParamValue } from '../../../tools/utils';

@Component({
  selector: 'arlas-analytics-menu',
  templateUrl: './analytics-menu.component.html',
  styleUrls: ['./analytics-menu.component.scss']
})
export class AnalyticsMenuComponent implements OnInit {

  /**
   * @Input : Angular
   * @description If no tab is selected based on the url, indicates which tab index to select by default.
   * If none is supplied, then no tab is displayed by default
   */
  @Input() public tabIndexByDefault?: number;

  /**
   * @Input : Angular
   * @description List of groups. Each group contains one or more widgets.
   */
  @Input() public groups: Array<AnalyticGroupConfiguration>;

  /**
   * @Input : Angular
   * @description Whether to show the indicator of filters applied on this tab.
   */
  @Input() public showIndicators = false;

  public constructor(
    public analyticsService: AnalyticsService
  ) { }

  public ngOnInit(): void {
    // Get active tab from url
    const tab = getParamValue('at');
    if (tab) {
      const tabIndex = this.analyticsService.tabs.map(t => t.name).indexOf(decodeURI(tab));
      if (tabIndex >= 0) {
        this.selectTab(tabIndex);
      }
    }

    // Load tab by default if one was given, and no tab is currently selected
    if (this.analyticsService.activeTab === undefined && this.tabIndexByDefault !== undefined
        && this.tabIndexByDefault < this.analyticsService.tabs.length) {
      this.selectTab(this.tabIndexByDefault);
    }
  }

  /**
   * Method called when clicking on a tab to select or unselect it. If already selected, unselects it.
   * @param index Index of the tab selected in the list of tabs
   */
  public selectTab(index: number) {
    this.analyticsService.selectTab(index === this.analyticsService.activeTab ? undefined : index);
  }

  /**
   * Remove all the filters linked to the contributors of the clicked tab
   * @param tabId The name of the tab clicked
   * @param event The click event fired when clicked
   */
  public removeTabFilter(tabId: string, event: any) {
    // find out the type of the click event
    this.analyticsService.removeTabFilter(tabId);
    event.stopPropagation();
  }
}
