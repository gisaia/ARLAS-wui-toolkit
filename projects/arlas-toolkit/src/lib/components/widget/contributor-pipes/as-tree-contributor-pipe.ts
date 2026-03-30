import { Pipe, PipeTransform } from '@angular/core';
import { TreeContributor } from 'arlas-web-contributors';
import { Contributor } from 'arlas-web-core';

@Pipe({
  name: 'asTreeContributor',
})
export class AsTreeContributorPipe implements PipeTransform {

  public transform(contributor: Contributor): TreeContributor {
    return contributor as TreeContributor;
  }

}
