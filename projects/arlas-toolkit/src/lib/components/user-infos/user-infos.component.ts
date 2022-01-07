import { Component, OnInit } from '@angular/core';
import { AuthentificationService } from '../../services/authentification/authentification.service';

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

  public constructor(private authentService: AuthentificationService) {
    this.authentService.loadUserInfo().subscribe(data => {
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
  }

  public ngOnInit() {

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
