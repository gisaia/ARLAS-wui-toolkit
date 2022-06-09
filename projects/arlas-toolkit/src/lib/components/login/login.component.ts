import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ArlasIamService } from '../../services/arlas-iam/arlas-iam.service';
import { ArlasSettingsService } from '../../services/settings/arlas.settings.service';
import { Router } from '@angular/router';
import { RefreshToken, Configuration } from 'arlas-iam-api';

@Component({
  selector: 'arlas-tool-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public showPassword = false;
  public loginForm: FormGroup;

  public constructor(
    private formBuilder: FormBuilder,
    private iamService: ArlasIamService,
    private settings: ArlasSettingsService,
    private router: Router
  ) { }

  public ngOnInit(): void {
    const refreshToken: RefreshToken = JSON.parse(localStorage.getItem('refreshToken'));
    if (!!refreshToken) {
      this.iamService.setOptions({
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('accessToken')
        }
      });
      this.iamService.refresh(refreshToken.value).subscribe(response => {
        const accessToken = (response as any).accessToken;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', JSON.stringify((response as any).refreshToken));
        this.iamService.setOptions({
          headers: {
            Authorization: 'Bearer ' + accessToken
          }
        });
        this.iamService.currentUserSubject.next({ accessToken: response.accessToken, refreshToken: response.refreshToken });

        this.router.navigate(['/']);


      });
    }

    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', [Validators.required]]
    });
  }

  public onSubmit(): void {
    this.iamService.login(this.loginForm.get('email').value, this.loginForm.get('password').value).subscribe(
      session => {
        localStorage.setItem('accessToken', (session as any).accessToken);
        localStorage.setItem('refreshToken', JSON.stringify((session as any).refreshToken));
        this.iamService.currentUserSubject.next({ accessToken: (session as any).accessToken, refreshToken: (session as any).refreshToken });

        this.iamService.startRefreshTokenTimer(this.settings.settings.authentication);

        if (this.iamService.currentUserValue) {
          this.router.navigate(['/']);
        }
      },
      error => {
        this.loginForm.setErrors({
          wrong: true
        });
      }

    );
  }

}
