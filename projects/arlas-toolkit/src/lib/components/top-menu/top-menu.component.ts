import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AuthentificationService } from '../../services/authentification/authentification.service';
import { ArlasIamService } from '../../services/arlas-iam/arlas-iam.service';
import { AboutComponent } from './about/about.component';
import { TranslateService } from '@ngx-translate/core';
import { UserInfosComponent } from '../user-infos/user-infos.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ArlasSettingsService } from '../../services/settings/arlas.settings.service';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { FetchInterceptorService } from '../../services/interceptor/fetch-interceptor.service';

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
  public initials: string;
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

  /**
   * @Input : Angular
   * @description Whether to display the "About" button
   */
  @Input() public showAboutButton = true;

  public showLinks = false;
  public linksEnabled = false;
  @ViewChild('about', { static: false }) private aboutcomponent: AboutComponent;

  public constructor(
    private authentService: AuthentificationService,
    private arlasIamService: ArlasIamService,
    private translate: TranslateService,
    private router: Router,
    private dialog: MatDialog,
    private settingsService: ArlasSettingsService,
    private fetchInterceptor: FetchInterceptorService
  ) {
    this.extraAboutText = this.translate.instant('extraAboutText') === 'extraAboutText' ? '' : this.translate.instant('extraAboutText');
    this.aboutFile = 'assets/about/about_' + this.translate.currentLang + '.md?' + Date.now() + '.md';
  }

  public ngOnInit(): void {
    const links = this.settingsService.getLinksSettings();
    this.linksEnabled = !!links && links.length > 0;
    const authSettings = this.settingsService.getAuthentSettings();
    this.authentMode = !!authSettings ? authSettings.auth_mode : undefined;
    this.isAuthentActivated = !!authSettings && !!authSettings.use_authent;
    if (this.isAuthentActivated && !this.authentMode) {
      this.authentMode = 'openid';
    }
    if (this.authentMode === 'openid') {
      const claims = this.authentService.identityClaims as any;
      this.authentService.canActivateProtectedRoutes.subscribe(isConnected => {
        this.connected = isConnected;
        if (isConnected) {
          this.name = claims.nickname;
          this.avatar = claims.picture;
          this.initials = this.getInitials(this.name);
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
            this.initials = this.getInitials(this.name);
          } else {
            this.connected = false;
            this.name = '';
            this.initials = '';
          }
        },
        error: () => {
          this.connected = false;
        }
      });
    }

    /** This is a method to listen to logging out event from other tabs of the same domain. */
    window.addEventListener('storage', (event) => {
      if (event.key === 'arlas-logout-event' && this.connected) {
        if (this.authentMode === 'openid') {
          this.authentService.logout();
        } else if (this.authentMode === 'iam') {
          this.arlasIamService.logoutWithoutRedirection();
          this.fetchInterceptor.interceptLogout();
        }
      }
    });
  }

  public connect() {
    const authSettings = this.settingsService.getAuthentSettings();
    if (this.authentMode === 'openid') {
      if (this.connected) {
        this.authentService.logout();
      } else {
        this.authentService.login();
      }
    } else if (this.authentMode === 'iam') {
      if (this.connected) {
        if (authSettings && authSettings.force_connect) {
          this.arlasIamService.logout(['/login']);
        } else {
          this.arlasIamService.logout(['/']);
        }
      } else {
        this.router.navigate(['login']);
      }
    }
  }

  public changePassword(){
    this.dialog.open(ChangePasswordComponent, {panelClass: 'change-dialog'});
  }

  public displayAbout() {
    this.aboutcomponent.openDialog();
  }

  public getUserInfos() {
    this.dialog.open(UserInfosComponent);
  }

  public getInitials(name) {
    if (!!name && name !== '') {
      return name[0];
    } else {
      return '';
    }
  }
}
