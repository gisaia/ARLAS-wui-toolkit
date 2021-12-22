/*
 * Licensed to Gisaïa under one or more contributor
 * license agreements. See the NOTICE.txt file distributed with
 * this work for additional information regarding copyright
 * ownership. Gisaïa licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { Component, OnInit } from '@angular/core';
import { Error } from '../../services/startup/startup.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ErrorService } from '../../services/error/error.service';

/**
 * This component displays error messages due to misconfiguration of ARLAS-wui or to a broken connection to ARLAS-server.
 */
@Component({
  selector: 'arlas-tool-errormodal',
  templateUrl: './errormodal.component.html',
  styleUrls: ['./errormodal.component.css']
})
export class ErrormodalComponent implements OnInit {
  public dialogRef: MatDialogRef<any>;
  public constructor(public dialog: MatDialog, private errorService: ErrorService) {

  }
  public ngOnInit() {
    if (this.errorService.errorsQueue && this.errorService.errorsQueue.length > 0) {
      this.openDialog();
      this.dialogRef.componentInstance.messages = this.errorService.errorsQueue;
    }
    this.errorService.errorEmitter.subscribe((err: Error) => {
      this.openDialog();
      this.dialogRef.componentInstance.messages = [err];
    });
  }
  public openDialog() {
    this.dialogRef = this.dialog.open(ErrorModalMsgComponent);
  }
}

@Component({
  selector: 'arlas-tool-errormodal-msg',
  templateUrl: './errormodalmsg.component.html',
})
export class ErrorModalMsgComponent {
  public messages: Array<Error>;
  public constructor(public dialogRef: MatDialogRef<ErrorModalMsgComponent>) { }
}
