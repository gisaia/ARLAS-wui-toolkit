import { Pipe, PipeTransform } from '@angular/core';
import { SwimLaneContributor } from 'arlas-web-contributors';
import { Contributor } from 'arlas-web-core';

@Pipe({
  name: 'asSwimlaneContributor',
})
export class AsSwimlaneContributorPipe implements PipeTransform {

  public transform(contributor: Contributor): SwimLaneContributor {
    return contributor as SwimLaneContributor;
  }

}
