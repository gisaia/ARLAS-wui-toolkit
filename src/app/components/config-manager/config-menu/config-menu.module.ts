import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigMenuComponent } from './config-menu.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatMenuModule, MatIconModule, MatButtonModule } from '@angular/material';
import { ActionModalModule } from '../action-modal/action-modal.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    MatMenuModule,
    MatIconModule,
    ActionModalModule,
    MatButtonModule
  ],
  exports: [
    ConfigMenuComponent
  ],
  declarations: [
    ConfigMenuComponent
  ]
})
export class ConfigMenuModule { }
