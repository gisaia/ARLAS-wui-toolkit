import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ToolkitComponent } from './toolkit.component';
import { VerifyComponent } from './components/verify/verify.component';
import { ResetComponent } from './components/reset/reset.component';
import { ForgotComponent } from './components/forgot/forgot.component';

export const routes: Routes = [
  { path: '', component: ToolkitComponent },
  { path: 'callback', redirectTo: '' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'verify/:id/user/:token', component: VerifyComponent },
  { path: 'password_forgot', component: ForgotComponent },
  { path: 'reset/:id/user/:token', component: ResetComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class ToolkitRoutingModule { }
