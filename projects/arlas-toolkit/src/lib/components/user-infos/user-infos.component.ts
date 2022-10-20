import { Component, OnInit } from '@angular/core';
import { AuthentificationService } from '../../services/authentification/authentification.service';
import { ArlasIamService } from '../../services/arlas-iam/arlas-iam.service';

@Component({
  selector: 'arlas-user-infos',
  templateUrl: './user-infos.component.html',
  styleUrls: ['./user-infos.component.css']
})
export class UserInfosComponent implements OnInit {

  public userData;
  public roles: string[];
  public organisation: string;
  public groups: string[];
  public name: string;
  public email: string;
  public avatar: string;

  public constructor(
    private authentService: AuthentificationService,
    private arlasIamService: ArlasIamService
  ) { }

  public ngOnInit() {
    if (!!this.authentService.authConfigValue && this.authentService.authConfigValue.auth_mode !== 'iam') {
      this.authentService.loadUserInfo().subscribe(user => {
        const data = user.info;
        this.name = data['nickname'];
        this.email = data['name'];
        this.roles = data['http://arlas.io/roles'].filter(r => r.startsWith('role/'))
          .map(r => this.computeName(r));
        this.groups = data['http://arlas.io/roles'].filter(r => r.startsWith('group/'))
          .map(r => r.split('/')[r.split('/').length - 1]);
        this.organisation = data['http://arlas.io/roles'].filter(r => r.startsWith('org/'))
          .map(r => this.computeName(r));
        this.avatar = data['picture'];
      });
    } else if (!!this.authentService.authConfigValue && this.authentService.authConfigValue.auth_mode === 'iam') {
      const userInfos = this.arlasIamService.currentUserValue.user;
      this.name = userInfos.email;
      this.email = userInfos.email;
      this.roles = userInfos.roles.filter(r => r.fullName.startsWith('role/'))
        .map(r => this.computeName(r));
      this.organisation = userInfos.organisations.map(o => o.displayName).join(',');
      this.avatar = '';

    }
  }

  public computeName = (n) => {
    if (typeof n !== 'string') {
      return '';
    }
    const list = n.split('/');
    list.shift();
    return list.join(' ');
  };
}
