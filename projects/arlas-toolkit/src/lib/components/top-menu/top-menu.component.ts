import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AuthentificationService } from '../../services/authentification/authentification.service';
import { ArlasIamService } from '../../services/arlas-iam/arlas-iam.service';
import { AboutComponent } from './about/about.component';
import { TranslateService } from '@ngx-translate/core';
import { UserInfosComponent } from '../user-infos/user-infos.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ArlasSettingsService } from '../../services/settings/arlas.settings.service';

@Component({
  selector: 'arlas-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.scss']
})
export class TopMenuComponent implements OnInit {

  public connected: boolean;
  public isAuthentActivated: boolean;
  public authentMode;

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
    private arlasIamService: ArlasIamService,
    private translate: TranslateService,
    private router: Router,
    private dialog: MatDialog,
    private settingsService: ArlasSettingsService
  ) {
    this.extraAboutText = this.translate.instant('extraAboutText') === 'extraAboutText' ? '' : this.translate.instant('extraAboutText');
    this.aboutFile = 'assets/about/about_' + this.translate.currentLang + '.md?' + Date.now() + '.md';
  }

  public ngOnInit(): void {
    this.authentMode = !!this.settingsService.getAuthentSettings() ? this.settingsService.getAuthentSettings().auth_mode : undefined;
    this.isAuthentActivated = !!this.settingsService.getAuthentSettings() && !!this.settingsService.getAuthentSettings().use_authent;
    if (this.authentMode === 'openid') {
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
    } else if (this.authentMode === 'iam') {
      this.connected = false;
      this.arlasIamService.tokenRefreshed$.subscribe({
        next: (data) => {
          if (!!data) {
            this.connected = true;
            this.name = data?.user.email;
            this.avatar = this.getInitials(this.name);
          } else {
            this.connected = false;
            this.name = '';
            this.avatar = '';
          }
        },
        error: () => {
          this.connected = false;
        }
      });
    }
  }

  public connect() {
    if (this.authentMode === 'openid') {
      if (this.connected) {
        this.authentService.logout();
      } else {
        this.authentService.login();
      }
    } else if (this.authentMode === 'iam') {
      if (this.connected) {
        this.arlasIamService.logout(['/']);
      } else {
        this.router.navigate(['login']);
      }
    }
  }

  public displayAbout() {
    this.aboutcomponent.openDialog();
  }

  public getUserInfos() {
    this.dialog.open(UserInfosComponent);
  }

  public getInitials(name) {

    const canvas = document.createElement('canvas');
    canvas.style.display = 'none';
    canvas.width = 32;
    canvas.height = 32;
    document.body.appendChild(canvas);


    const context = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 16;
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    context.fillStyle = '#999';
    context.fill();
    context.font = '16px Roboto';
    context.fillStyle = '#eee';

    if (name && name !== '') {
      const first = name[0];
      context.fillText(first.toUpperCase(), 10, 23);
      const data = canvas.toDataURL();
      document.body.removeChild(canvas);
      return data;
    } else {
      return '';
    }
  }
}
