import { Component, OnInit } from '@angular/core';
import { ArlasConfigService, ArlasCollaborativesearchService } from '../../services/startup.service';
import { MatDialog, MatDialogRef } from '@angular/material';

@Component({
  selector: 'arlas-tool-errormodal',
  templateUrl: './errormodal.component.html',
  styleUrls: ['./errormodal.component.css']
})
export class ErrormodalComponent implements OnInit {
  public dialogRef: MatDialogRef<any>;
  constructor(public dialog: MatDialog, private configService: ArlasConfigService,
    private collaborativeService: ArlasCollaborativesearchService) {

  }
  public ngOnInit() {
    this.configService.confErrorBus
      .bufferWhen(() => this.configService.confErrorBus.debounceTime(5000))
      .subscribe(k => {
        this.openDialog();
        const listError = [];
        if (this.configService.getConfig()['error'] === undefined) {
          k.forEach(m => listError.push('Key configuration problem : \n' + m + ' missing'));
        } else {
          listError.push('Current configuration have some problems :');
          (<any>k[0]).forEach(m => listError.push(m));
        }
        this.dialogRef.componentInstance.messages = listError;
      });
    this.collaborativeService.collaborationErrorBus
      .bufferWhen(() => this.collaborativeService.collaborationErrorBus.debounceTime(5000))
      .subscribe(response => {
        this.openDialog();
        this.dialogRef.componentInstance.messages = response;
      });
  }
  public openDialog() {
    this.dialogRef = this.dialog.open(ErrorModalMsgComponent);
  }
}

@Component({
  selector: 'arlas-tool-errormodal-msg',
  template: '<h2>Application error</h2> ' +
  '<ul> <div *ngFor=\"let message of messages\"> <li>{{message}}</li> </div> </ul>' +
  '<button md-raised-button (click)=\"dialogRef.close()\">Close</button>',
})
export class ErrorModalMsgComponent {
  public messages: Array<string>;
  constructor(public dialogRef: MatDialogRef<ErrorModalMsgComponent>) { }
}
