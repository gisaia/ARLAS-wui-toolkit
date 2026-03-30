import { Pipe, PipeTransform } from '@angular/core';
import { ResultListContributor } from 'arlas-web-contributors';
import { Contributor } from 'arlas-web-core';

@Pipe({
  name: 'asListContributor',
})
export class AsListContributorPipe implements PipeTransform {

  public transform(contributor: Contributor): ResultListContributor {
    return contributor as ResultListContributor;
  }

}
