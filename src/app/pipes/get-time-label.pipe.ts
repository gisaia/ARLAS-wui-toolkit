import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { utcFormat, timeFormat } from 'd3-time-format';

@Pipe({
  name: 'getTimeLabel'
})
export class GetTimeLabelPipe implements PipeTransform {

  public transform(label: string, format: string, translate: TranslateService, useUtc: boolean): any {
    if (label) {
      const startEndValues = label.split('to');
      if (startEndValues.length > 1) {
        const start = new Date(+startEndValues[0]);
        const end = new Date(+startEndValues[1]);
        if (!format) {
          format = '%d/%m/%Y %H:%M';
        }
        if (useUtc) {
          return translate.instant('From') + ' ' + (utcFormat(format)(start) + ' '
            + translate.instant('to') + ' ' + utcFormat(format)(end));
        } else {
          return translate.instant('From') + ' ' + (timeFormat(format)(start) + ' '
            + translate.instant('to') + ' ' + timeFormat(format)(end));
        }
      } else {
        return translate.instant(label);
      }
    } else {
      return label;
    }
  }

}
