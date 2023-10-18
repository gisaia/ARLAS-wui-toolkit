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
