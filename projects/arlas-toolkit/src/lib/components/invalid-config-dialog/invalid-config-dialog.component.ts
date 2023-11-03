import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DashboardDeniedData } from '../../tools/utils';
import { ArlasSettingsService } from '../../services/settings/arlas.settings.service';
@Component({
  selector: 'arlas-tool-invalid-config-dialog',
  templateUrl: './invalid-config-dialog.component.html',
  styleUrls: ['./invalid-config-dialog.component.scss']
})
export class InvalidConfigDialogComponent implements OnInit {

  public configId: string;
  public status;
  public ERROR_MESSAGE;
  public ACTION_MESSAGE;
  public showAction = true;
  public constructor(
    @Inject(MAT_DIALOG_DATA) data: DashboardDeniedData,
    private settingsService: ArlasSettingsService) {
    this.configId = data.id;
    const error = data.error;
    if (!!error && error.status) {
      this.status = error.status;
    }
  }

  public ngOnInit() {
    if (this.status === 403) {
      this.ACTION_MESSAGE = 'go to arlas hub';
      this.ERROR_MESSAGE = 'dashboard access not authorized';
      this.showAction = !!this.settingsService.getArlasHubUrl();
    } else if (this.status === 401) {
      // propose to login if we could keep the config id after authentication, otherwise we should go to hub
      // this.ACTION_MESSAGE = 'Login';
      this.ACTION_MESSAGE = 'go to arlas hub';
      this.ERROR_MESSAGE = 'dashboard access not authorized';
      this.showAction = !!this.settingsService.getArlasHubUrl();
    } else {
      this.ERROR_MESSAGE = 'The connection to dashbords is lost';
    }
  }

  public goToArlasHub() {
    const hubUrl = this.settingsService.getArlasHubUrl();
    if (!!hubUrl) {
      window.open(hubUrl);
    }
  }
}
