import { Injectable } from '@angular/core';
import { AuthentSetting } from '../../tools/utils';

@Injectable({
  providedIn: 'root'
})
export class ArlasAuthentificationService {

  public authConfigValue: AuthentSetting;

  public constructor() { }
}
