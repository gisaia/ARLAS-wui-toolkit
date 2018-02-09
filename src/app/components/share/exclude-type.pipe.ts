import { Pipe, PipeTransform } from '@angular/core';
import { ArlasSearchField } from '../../components/share/model/ArlasSearchField';

@Pipe({ name: 'excludeType' })
export class ExcludeTypePipe implements PipeTransform {

  public transform(allField: ArlasSearchField[], type: Set<string>) {
    return allField.filter(field => !type.has(field.type));
  }
}
