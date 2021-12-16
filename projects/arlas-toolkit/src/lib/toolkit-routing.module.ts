import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppComponent } from "../../../../src/app/app.component";

export const routes: Routes = [
  { path: '', component: AppComponent },
  { path: 'callback', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class ToolkitRoutingModule { }
