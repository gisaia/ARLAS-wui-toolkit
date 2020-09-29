import { Component, OnInit, Inject } from '@angular/core';
import { AuthentificationService } from '../../services/authentification/authentification.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'arlas-tool-invalid-config-dialog',
  templateUrl: './invalid-config-dialog.component.html',
  styleUrls: ['./invalid-config-dialog.component.css']
})
export class InvalidConfigDialogComponent implements OnInit {

  public configId: string;
  constructor(@Inject(MAT_DIALOG_DATA) data) {
    this.configId = data.configId;
  }

  public ngOnInit() {
  }
}
