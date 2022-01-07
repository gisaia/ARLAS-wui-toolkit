import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ToolkitComponent } from './toolkit.component';

export const routes: Routes = [
  { path: '', component: ToolkitComponent },
  { path: 'callback', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class ToolkitRoutingModule { }
