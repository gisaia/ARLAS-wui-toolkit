import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'arlas-tool-confirm-modal-msg',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.css']
})
export class ConfirmModalComponent {
  public confirmMessage: string;
  constructor(public dialogRef: MatDialogRef<ConfirmModalComponent>) { }
}
