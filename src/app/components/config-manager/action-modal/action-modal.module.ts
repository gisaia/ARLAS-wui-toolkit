import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActionModalComponent } from './action-modal.component';
import { ErrorService } from '../../../services/error/error.service';
import { PersistenceService } from '../../../services/persistence/persistence.service';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    MatMenuModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule
  ],
  exports: [
    ActionModalComponent
  ],
  declarations: [
    ActionModalComponent
  ],
  entryComponents: [ActionModalComponent],
  providers: [
    PersistenceService
  ]
})
export class ActionModalModule { }
