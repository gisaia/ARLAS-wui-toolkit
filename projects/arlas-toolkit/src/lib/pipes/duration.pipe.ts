import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration'
})
export class DurationPipe implements PipeTransform {

  public transform(startDate: number | undefined, enDate: number | undefined, useDateNow?: boolean): string {
    if (!startDate || isNaN(startDate) || !enDate || isNaN(enDate) ) {
      return '--';
    }
    const selectedEndDate = useDateNow ? Date.now() : enDate;
    // Calculate the difference in milliseconds and convert to seconds
    const diffInSeconds = (selectedEndDate - startDate) / 1000;

    // Return seconds if less than 60, otherwise return minutes
    if (diffInSeconds < 60) {
      return `${Math.max(0, Math.floor(diffInSeconds))} s`;
    } else {
      const minutes = diffInSeconds / 60;
      return `${minutes.toFixed(1)} min`;
    }
  }


}
