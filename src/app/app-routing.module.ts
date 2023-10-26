import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../../projects/arlas-toolkit/src/lib/components/login/login.component';
import { ContactComponent } from './components/contact/contact.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuardIamService } from '../../projects/arlas-toolkit/src/lib/services/arlas-iam/auth-guard-iam.service';
import { RegisterComponent } from '../../projects/arlas-toolkit/src/lib/components/register/register.component';
import { VerifyComponent } from '../../projects/arlas-toolkit/src/lib/components/verify/verify.component';
import { ResetComponent } from '../../projects/arlas-toolkit/src/lib/components/reset/reset.component';
import { ForgotComponent } from '../../projects/arlas-toolkit/src/lib/components/forgot/forgot.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent,},
  { path: 'contact', component: ContactComponent},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'verify/:id/user/:token', component: VerifyComponent },
  { path: 'password_forgot', component: ForgotComponent },
  { path: 'reset/:id/user/:token', component: ResetComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  // otherwise redirect to login
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
