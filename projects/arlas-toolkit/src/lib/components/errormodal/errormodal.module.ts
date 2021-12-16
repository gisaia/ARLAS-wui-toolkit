import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorModalMsgComponent, ErrormodalComponent } from './errormodal.component';
import { TranslateModule } from '@ngx-translate/core';
import { ErrorService } from '../../services/error/error.service';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule
  ],
  exports: [
    ErrorModalMsgComponent,
    ErrormodalComponent
  ],
  declarations: [
    ErrormodalComponent,
    ErrorModalMsgComponent,
  ],
  entryComponents: [ErrorModalMsgComponent],
  providers: [
    ErrorService
  ]
})
export class ErrorModalModule { }
