/*
 * Licensed to Gisaïa under one or more contributor
 * license agreements. See the NOTICE.txt file distributed with
 * this work for additional information regarding copyright
 * ownership. Gisaïa licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { NgModule, forwardRef } from '@angular/core';
import { TagComponent, TagDialogComponent } from './components/tag/tag.component';
import { ArlasTagService } from './services/tag/tag.service';
import {
  MatIconModule,
  MatProgressBarModule,
  MatSelectModule,
  MatOptionModule,
  MatCheckboxModule,
  MatFormFieldModule
} from '@angular/material';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { CustomTranslateLoader } from './app.module';

@NgModule({
  declarations: [
    TagComponent,
    TagDialogComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatOptionModule,
    MatProgressBarModule,
    MatSelectModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: CustomTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
  exports: [
    TagComponent
  ],
  providers: [
    forwardRef(() => ArlasTagService)
  ],
  bootstrap: [],
  entryComponents: [TagDialogComponent],
})
export class ArlasTaggerModule { }
