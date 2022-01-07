import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Error } from '../startup/startup.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  public errorsQueue: Array<Error> = new Array();
  public errorEmitter: Subject<Error> = new Subject();
}
