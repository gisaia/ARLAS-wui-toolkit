import { Component, OnInit, Inject } from '@angular/core';
import { AuthentificationService } from '../../services/authentification/authentification.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'arlas-tool-reconnect-dialog',
  templateUrl: './reconnect-dialog.component.html',
  styleUrls: ['./reconnect-dialog.component.css']
})
export class ReconnectDialogComponent implements OnInit {

  public code: number;
  public authService;
  public constructor(private authentService: AuthentificationService,
    @Inject(MAT_DIALOG_DATA) data) {
    this.code = data.code;
  }

  public ngOnInit() {
  }

  public login() {
    this.authentService.login();
  }

  public logout() {
    this.authentService.logout();
  }
}
