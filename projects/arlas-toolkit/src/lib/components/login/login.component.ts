import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RefreshToken } from 'arlas-iam-api';
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
        const accessToken = response.accessToken;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', JSON.stringify(response.refreshToken));
        this.iamService.setOptions({
          headers: {
            Authorization: 'Bearer ' + accessToken
          }
        });
        this.iamService.currentUserSubject.next({ accessToken: accessToken, refreshToken: response.refreshToken, userId: response.user.id });
        this.router.navigate(['/']);
      });
    }

    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', [Validators.required]]
    });
  }

  public onSubmit(): void {
    this.iamService.login(this.loginForm.get('email').value, this.loginForm.get('password').value).subscribe({
      next: session => {
        localStorage.setItem('accessToken', session.accessToken);
        localStorage.setItem('refreshToken', JSON.stringify(session.refreshToken));
        this.iamService.currentUserSubject.next(
          { accessToken: session.accessToken, refreshToken: session.refreshToken, userId: session.user.id }
        );

        this.iamService.startRefreshTokenTimer(this.settings.settings.authentication);

        if (this.iamService.currentUserValue) {
          this.router.navigate(['/']);
        }
      },
      error: () => {
        this.loginForm.setErrors({
          wrong: true
        });
      }
    }

    );
  }

}
