import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginData, RefreshToken } from 'arlas-iam-api';
import { ArlasIamService } from '../../services/arlas-iam/arlas-iam.service';
import { ArlasSettingsService } from '../../services/settings/arlas.settings.service';

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
    private router: Router
  ) { }

  public ngOnInit(): void {
    const refreshToken: RefreshToken = this.iamService.getRefreshToken();
    if (!!refreshToken) {
      /** set latest stored headers info. */
      const accessToken = this.iamService.getAccessToken();
      this.iamService.setHeadersFromAccesstoken(accessToken);
      this.iamService.refresh(refreshToken.value).subscribe({
        next: (loginData: LoginData) => {
          this.iamService.user = loginData.user;
          this.iamService.setHeadersFromAccesstoken(loginData.accessToken);
          this.iamService.storeRefreshToken(loginData.refreshToken);
          this.iamService.notifyTokenRefresh(loginData);
          this.router.navigate(['/']);
        },
        error: () => {
          this.iamService.logoutWithoutRedirection();
        }
      });
    }

    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', [Validators.required]]
    });
  }

  public onSubmit(): void {
    this.iamService.login(this.loginForm.get('email').value, this.loginForm.get('password').value).subscribe({
      next: loginData => {
        this.iamService.user = loginData.user;
        this.iamService.setHeadersFromAccesstoken(loginData.accessToken);
        this.iamService.storeRefreshToken(loginData.refreshToken);
        this.iamService.notifyTokenRefresh(loginData);
        this.iamService.startRefreshTokenTimer(loginData);
        this.router.navigate(['/']);
      },
      error: () => {
        this.iamService.logoutWithoutRedirection();
        this.loginForm.setErrors({
          wrong: true
        });
      }
    }

    );
  }

}
