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