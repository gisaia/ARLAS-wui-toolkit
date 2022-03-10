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
   * @description Description of the group
   */
  description?: string;
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

export interface WidgetConfiguration {
  /**
   * @description Identifier of the contributor that serves data to the graphic component.
   */
  contributorId: string;
  /**
   * @description swimlane | histogram | donut | powerbars | resultlist
   */
  componentType?: string;
    /**
   * @description whether we display export csv button
   */
  showExportCsv?: boolean;
  /**
   * @description Set of inputs of a ARLAS-web-component.
   */
  input: any;
}

export interface AnalyticsTabs {
  name: string;
  icon: string;
  showName: boolean;
  showIcon: boolean;
}
