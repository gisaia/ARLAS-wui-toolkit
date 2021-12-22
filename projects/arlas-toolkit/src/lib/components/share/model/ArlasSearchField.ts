export class ArlasSearchField {

  /**
   * @description The field label
   */
  public label: string;
  /**
   * @description The type of the field.
   */
  public type: string;

  public constructor(label: string, type: string) {
    this.label = label;
    this.type = type;
  }
}
