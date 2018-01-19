import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import {ModuleWithProviders} from '@angular/core';

export const ROUTES: Routes = [
  { path: '', component: AppComponent }
];
export const routing = RouterModule.forRoot(ROUTES);
