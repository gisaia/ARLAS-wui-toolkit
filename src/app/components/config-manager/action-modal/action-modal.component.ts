import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfigActionEnum, ConfigAction } from '../config-menu/config-menu.component';
@Component({
  selector: 'arlas-action-modal',
  templateUrl: './action-modal.component.html',
  styleUrls: ['./action-modal.component.css']
})
export class ActionModalComponent {

  public type: ConfigActionEnum;
  public name: string;
  public configId: string;
  public value: string;
  public ConfigAction = ConfigActionEnum;
  constructor(
    @Inject(MAT_DIALOG_DATA) data: ConfigAction) {
    this.name = data.name;
    this.configId = data.configId;
    this.type = data.type;
  }
}


