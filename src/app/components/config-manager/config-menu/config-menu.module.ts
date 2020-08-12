import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigMenuComponent } from './config-menu.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ActionModalModule } from '../action-modal/action-modal.module';
import { ErrorService } from '../../../services/error/error.service';

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
  ],
  providers: [
    ErrorService,
  ]
})
export class ConfigMenuModule { }
