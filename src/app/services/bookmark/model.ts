<<<<<<< HEAD
import { Observable } from 'rxjs/Observable';

export enum BookMarkType {
  enumIds,
  filterWithTime,
  filterWithoutTime
}

export interface BookMark {
  id: string;
  date: Date;
  name: string;
  prettyFilter: string;
  url: string;
  type: BookMarkType;
  color: string;
  count: Observable<number>;
}
=======
import { Observable } from "rxjs/Observable";

export enum BookMarkType {
    enumIds,
    filterWithTime,
    filterWithoutTime
  }
  
  export interface BookMark {
    id: string;
    date: Date;
    name: string;
    prettyFilter: string;
    url: string;
    type: BookMarkType;
    color: string;
    count: Observable<number>;
  }
>>>>>>> b3374e62e3a90fe0d28ea78b0f30f65f0b4cc0a1
