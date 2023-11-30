import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import en from 'arlas-web-components/assets/i18n/en.json';
import fr from 'arlas-web-components/assets/i18n/fr.json';
import { Observable } from 'rxjs/internal/Observable';
import { LoginComponent } from './components/login/login.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RegisterComponent } from './components/register/register.component';
import { RouterModule } from '@angular/router';
import { VerifyComponent } from './components/verify/verify.component';
import { ResetComponent } from './components/reset/reset.component';
import { ForgotComponent } from './components/forgot/forgot.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { MatDialogModule } from '@angular/material/dialog';

export class CustomTranslateLoader implements TranslateLoader {

  public constructor(private http: HttpClient) { }

  public getTranslation(lang: string): Observable<any> {
    const apiAddress = 'assets/i18n/' + lang + '.json?' + Date.now();
    return Observable.create(observer => {
      this.http.get(apiAddress).subscribe(
        res => {
          let merged = res;
          // Properties in res will overwrite those in fr.
          if (lang === 'fr') {
            merged = { ...fr, ...res };
          } else if (lang === 'en') {
            merged = { ...en, ...res };
          }
          observer.next(merged);
          observer.complete();
        },
        error => {
          // failed to retrieve requested language file, use default
          observer.complete(); // => Default language is already loaded
        }
      );
    });
  }
}

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    VerifyComponent,
    ResetComponent,
    ForgotComponent,
    ChangePasswordComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: CustomTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
  exports: [
    LoginComponent
  ]
})
export class LoginModule { }
