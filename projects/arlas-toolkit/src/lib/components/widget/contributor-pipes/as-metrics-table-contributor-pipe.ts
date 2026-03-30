import { Pipe, PipeTransform } from '@angular/core';
import { MetricsTableContributor } from 'arlas-web-contributors';
import { Contributor } from 'arlas-web-core';

@Pipe({
  name: 'asMetricsTableContributor',
})
export class AsMetricsTableContributorPipe implements PipeTransform {

  public transform(contributor: Contributor): MetricsTableContributor {
    return contributor as MetricsTableContributor;
  }


}
