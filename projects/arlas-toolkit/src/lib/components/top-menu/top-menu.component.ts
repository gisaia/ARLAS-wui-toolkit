import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AuthentificationService } from '../../services/authentification/authentification.service';
import { AboutComponent } from './about/about.component';
import { TranslateService } from '@ngx-translate/core';
import { UserInfosComponent } from '../user-infos/user-infos.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'arlas-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.scss']
})
export class TopMenuComponent implements OnInit {

  public connected: boolean;
  public isAuthentActivated: boolean;

  public name: string;
  public avatar: string;

  public aboutFile: string;
  public extraAboutText: string;

  /**
   * @Input : Angular
   * @description Version of the WUI to display as info
   */
  @Input() public version: string;

  /**
   * @Input : Angular
   * @description Name of the WUI in which the bar is used
   */
  @Input() public wuiName: string;

  @ViewChild('about', { static: false }) private aboutcomponent: AboutComponent;

  public constructor(
    private authentService: AuthentificationService,
    private translate: TranslateService,
    private dialog: MatDialog
  ) {
    this.extraAboutText = this.translate.instant('extraAboutText') === 'extraAboutText' ? '' : this.translate.instant('extraAboutText');
    this.aboutFile = 'assets/about/about_' + this.translate.currentLang + '.md?' + Date.now() + '.md';

    this.isAuthentActivated = !!this.authentService.authConfigValue && !!this.authentService.authConfigValue.use_authent;
  }

  public ngOnInit(): void {
    const claims = this.authentService.identityClaims as any;
    this.authentService.canActivateProtectedRoutes.subscribe(isConnected => {
      this.connected = isConnected;
      if (isConnected) {
        this.name = claims.nickname;
        this.avatar = claims.picture;
      } else {
        this.name = '';
        this.avatar = '';
      }
    });
  }

  public connect() {
    if (this.connected) {
      this.authentService.logout();
    } else {
      this.authentService.login();
    }
  }

  public displayAbout() {
    this.aboutcomponent.openDialog();
  }

  public getUserInfos() {
    this.dialog.open(UserInfosComponent);
  }
}
