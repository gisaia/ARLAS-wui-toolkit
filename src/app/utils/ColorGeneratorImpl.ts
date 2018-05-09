import { ColorGenerator } from 'arlas-d3';

export class DonutColorGenerator implements ColorGenerator {

  public nodesColors: Array<Array<string>>;

  public getColor(field: string, value: string): string {
    let colorHex = null;
    let colorInList = false;
    if (this.nodesColors && this.nodesColors.length > 0) {
      for (let i = 0; i < this.nodesColors.length; i++) {
        const fieldValueColor = this.nodesColors[i];
        if (fieldValueColor.length === 3 && fieldValueColor[0] === field && fieldValueColor[1] === value) {
          colorHex = fieldValueColor[2];
          colorInList = true;
          break;
        }
      }
      if (!colorInList) {
        colorHex = this.getHexColor(field, value);
      }

    } else {
      colorHex = this.getHexColor(field, value);
    }
    return colorHex;
  }

  private getHexColor(field: string, value: string): string {
    const text = value + ':' + field;
      // string to int
      let hash = 0;
      for (let i = 0; i < text.length; i++) {
        hash = text.charCodeAt(i) + ((hash << 5) - hash);
      }
      // int to rgb
      const hex = (hash & 0x00FFFFFF).toString(16).toUpperCase();
      return '#' + '00000'.substring(0, 6 - hex.length) + hex;
  }
}
