import { Pipe, PipeTransform } from '@angular/core';
import { ComputeContributor } from 'arlas-web-contributors';
import { Contributor } from 'arlas-web-core';

@Pipe({
  name: 'asMetricContributor',
})
export class AsMetricContributorPipe implements PipeTransform {

  public transform(contributor: Contributor): ComputeContributor {
    return contributor as ComputeContributor;
  }

}
