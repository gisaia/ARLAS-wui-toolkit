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
  color: string;
  active: boolean;
  main: boolean;
}
