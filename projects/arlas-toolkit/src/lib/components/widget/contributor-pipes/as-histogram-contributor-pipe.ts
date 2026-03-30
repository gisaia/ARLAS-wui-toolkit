import { Pipe, PipeTransform } from '@angular/core';
import { HistogramContributor } from 'arlas-web-contributors';
import { Contributor } from 'arlas-web-core';

@Pipe({
  name: 'asHistogramContributor',
})
export class AsHistogramContributorPipe implements PipeTransform {

  public transform(contributor: Contributor): HistogramContributor {
    return contributor as HistogramContributor;
  }

}
