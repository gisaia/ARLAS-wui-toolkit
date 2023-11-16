import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DeniedAccessData } from '../../tools/utils';
import { ArlasError } from '../../tools/errors/error';
import { Subscription } from 'rxjs';
import { AuthentificationService } from '../../services/authentification/authentification.service';
import { ArlasIamService } from '../../services/arlas-iam/arlas-iam.service';
import { ArlasSettingsService } from '../../services/settings/arlas.settings.service';
import { Router } from '@angular/router';
@Component({
  selector: 'arlas-denied-access-dialog',
  templateUrl: './denied-access-dialog.component.html',
  styleUrls: ['./denied-access-dialog.component.scss']
})
export class DeniedAccessDialogComponent implements OnInit, OnDestroy {

  private isAuthentActivated: boolean;
  private authentMode;

  public forceAction = false;
  public arlasError: ArlasError;
  private actionSubscription: Subscription;
  public constructor(
    @Inject(MAT_DIALOG_DATA) data: DeniedAccessData,
    private settingsService: ArlasSettingsService,
    private authentService: AuthentificationService,
    private arlasIamService: ArlasIamService,
    private dialog: MatDialogRef<DeniedAccessDialogComponent>,
    private router: Router) {
    this.arlasError = data.error;
    this.forceAction = data.forceAction;
  }

  public ngOnInit() {
    const authSettings = this.settingsService.getAuthentSettings();
    this.authentMode = !!authSettings ? authSettings.auth_mode : undefined;
    this.isAuthentActivated = !!authSettings && !!authSettings.use_authent;
    if (this.isAuthentActivated && !this.authentMode) {
      this.authentMode = 'openid';
    }
    this.actionSubscription = this.arlasError.actionSeeker$.subscribe({
      next: (type) => {
        if (type === 'login') {
          this.login();
          this.dialog.close();
        }
      }
    });
  }

  public ngOnDestroy(): void {
    if (this.actionSubscription) {
      this.actionSubscription.unsubscribe();
    }
  }

  private login() {
    if (this.authentMode === 'openid') {
      this.authentService.login();
    } else if (this.authentMode === 'iam') {
      this.checkIamCurrentUrl();
      this.router.navigate(['login']);
    }
  }


  private checkIamCurrentUrl() {
    const url = new URL(window.location.href);
    const paramOrg = url.searchParams.get('org');
    const paramConfigId = url.searchParams.get('config_id');
    // it meanse it's arlas-wui, we will ask to login in arlas-wui ignoring the
    // login_uri, because after login we can go back to previous state !
    if (paramOrg && paramConfigId) {
      this.arlasIamService.declareReloadState(window.location.href);
    }
  }

}
