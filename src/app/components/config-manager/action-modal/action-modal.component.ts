import { Component, Inject, EventEmitter, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfigActionEnum, ConfigAction } from '../config-menu/config-menu.component';
import { Subject } from 'rxjs';
import { PersistenceService } from '../../../services/persistence/persistence.service';
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

  @Output() public duplicateEmitter = new EventEmitter();
  public duplicateError = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) data: ConfigAction,
    private dialogRef: MatDialogRef<ActionModalComponent>,
    private persistenceService: PersistenceService) {
    this.name = data.name;
    this.configId = data.configId;
    this.type = data.type;
  }

  public duplicate(value: string, configId: string) {
    this.persistenceService.duplicate('config.json', configId,
      value).subscribe(data => {
        this.duplicateError = '';
        this.dialogRef.close();
      },
      error => {
        this.duplicateError = 'A configuration with this name exists already, please choose another name.';
      });
  }


}


