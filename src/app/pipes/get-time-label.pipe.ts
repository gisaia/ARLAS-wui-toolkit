import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { utcFormat } from 'd3-time-format';

@Pipe({
  name: 'getTimeLabel'
})
export class GetTimeLabelPipe implements PipeTransform {

  public transform(label: string, format: string, translate: TranslateService): any {
    if (label) {
      const startEndValues = label.split('to');
      if (startEndValues.length > 1) {
        const start = new Date(+startEndValues[0]);
        const end = new Date(+startEndValues[1]);
        if (format) {
          const timeFormat = utcFormat(format);
          return translate.instant('From') + ' ' + (timeFormat(start) + ' ' + translate.instant('to') + ' ' + timeFormat(end));
        } else {
          return translate.instant('From') + ' ' + start.toUTCString().split(',')[1].replace('GMT', '') + ' ' +
            translate.instant('to') + ' ' + end.toUTCString().split(',')[1].replace('GMT', '');
        }
      } else {
        return translate.instant(label);
      }
    } else {
      return label;
    }
  }

}
