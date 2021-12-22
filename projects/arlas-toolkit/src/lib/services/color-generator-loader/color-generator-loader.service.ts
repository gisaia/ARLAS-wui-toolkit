import { Injectable } from '@angular/core';
import { mix } from 'tinycolor2';
import { ArlasConfigService, ArlasCollaborativesearchService } from '../startup/startup.service';
import { Aggregation } from 'arlas-api';
import { projType } from 'arlas-web-core';
import { ColorGeneratorLoader } from 'arlas-web-components';
import * as tinycolor from 'tinycolor2';

/**
 * This service allows to generate a color for a given term.
 * - colors associated to terms in `keysToColors` are considered first
 * - colors associated to terms from aggregations specified in `colorsAggregations` are considered second
 * - if no color is associated to a term, the color is generated with a determinist method.
 * - for generated colors, the saturation scale is tightened to the highest values with `colorsSaturationWeight`
 * If an external `externalKeysToColors` list is given to the service `getColor` method, it is used insted of `keysToColors`
 * If an external `externalColorsSaturationWeight` list is given to the service `getColor` method,
 * it is used insted of `colorsSaturationWeight`
 */
@Injectable()
export class ArlasColorGeneratorLoader implements ColorGeneratorLoader {
  // TODO: keysToColors should be private and only accessed with setters and getters
  public keysToColors: Array<[string, string]> = new Array<[string, string]>();
  public colorsSaturationWeight: number;
  public keysToColorsMap: Map<string, string> = new Map<string, string>();
  public colorAggregations: Array<[Aggregation, Aggregation]>;

  public constructor(
    private configService: ArlasConfigService,
    private collaborativesearchService: ArlasCollaborativesearchService) {
    const webConfig = this.configService.getValue('arlas.web');
    if (webConfig && webConfig.colorGenerator) {
      this.keysToColors = webConfig.colorGenerator.keysToColors;
      this.colorsSaturationWeight = webConfig.colorGenerator.colorsSaturationWeight;
      this.colorAggregations = webConfig.colorGenerator.colorAggregations;
    }
    if (this.colorAggregations) {
      this.setColorsFromAggregations();
    }
    if (this.colorsSaturationWeight === undefined || this.colorsSaturationWeight === null) {
      this.colorsSaturationWeight = 0.5;
    }
  }

  public getColor(key: string, externalKeysToColors?: Array<[string, string]>, externalColorsSaturationWeight?: number): string {
    let colorHex = null;
    const keysToColors = externalKeysToColors ? externalKeysToColors : this.keysToColors;
    const saturationWeight = (externalColorsSaturationWeight !== undefined && externalColorsSaturationWeight !== null) ?
      externalColorsSaturationWeight : this.colorsSaturationWeight;
    if (keysToColors) {
      for (let i = 0; i < keysToColors.length; i++) {
        const keyToColor = keysToColors[i];
        if (keyToColor[0] === key) {
          colorHex = keyToColor[1];
          break;
        }
      }
      if (!colorHex) {
        colorHex = this.getHexColor(key, saturationWeight);
      }
    } else {
      colorHex = this.getHexColor(key, saturationWeight);
    }
    return colorHex;
  }

  public getTextColor(color: string): string {
    return tinycolor.default(color).isDark() ? '#ffffff' : '#000000';
  }

  /**
   * updates the color of the given keyword if the keyword exists already. Otherwise it adds the new keyword and the corresponding color
   * @param keyword
   * @param color
   */
  public updateKeywordColor(keyword: string, color: string): void {
    const existingColor = this.keysToColorsMap.get(keyword);
    if (!existingColor) {
      this.keysToColorsMap.set(keyword, color);
      this.keysToColors.push([keyword, color]);
    } else {
      this.keysToColorsMap.set(keyword, color);
      /** rebuilt list from scratch */
      this.keysToColors = [];
      this.keysToColorsMap.forEach((c, k) => {
        this.keysToColors.push([k, c]);
      });
    }
  }

  /**
   * Set the keyToColors list. Updates the keysToColorsMap in order to be up to date with the list
   */
  public setKeysToColors(keysToColors: Array<[string, string]>): void {
    this.keysToColors = keysToColors;
    this.keysToColorsMap = new Map<string, string>();
    this.keysToColors.forEach(item => {
      this.keysToColorsMap.set(item[0], item[1]);
    });
  }

  private getHexColor(key: string, saturationWeight: number): string {
    const text = key.toString() + ':' + key.toString().split('').reverse().join('') + ':' + key.toString();
    // string to int
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }
    // int to rgb
    let hex = (hash & 0x00FFFFFF).toString(16).toUpperCase();
    hex = '00000'.substring(0, 6 - hex.length) + hex;
    const color = mix(hex, hex);
    color.lighten(5);
    const saturation = color.toHsv().s;
    if (saturation < (1 - saturationWeight) * 100) {
      const range = (1 - saturationWeight) * 100 - saturation;
      color.saturate(range);
    }
    color.brighten(10);
    return color.toHexString();
  }

  private setColorsFromAggregations(): void {
    this.keysToColorsMap = new Map<string, string>();
    this.keysToColors.forEach(item => {
      this.keysToColorsMap.set(item[0], item[1]);
    });
    if (this.colorAggregations) {
      this.colorAggregations.forEach(aggregations => {
        this.collaborativesearchService.resolveAggregation([projType.aggregate, aggregations], null,
          this.collaborativesearchService.defaultCollection)
          .subscribe(agg => {
            const firstAggregationElements = agg.elements;
            firstAggregationElements.forEach(element => {
              if (!this.keysToColorsMap.has(element.key) && element.elements && element.elements.length > 0) {
                this.keysToColorsMap.set(element.key, element.elements[0].key);
                this.keysToColors.push([element.key, element.elements[0].key]);
              }
            });
          });
      });
    }
  }

}
