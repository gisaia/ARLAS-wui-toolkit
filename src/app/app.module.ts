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
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArlasToolKitModule, ArlasToolkitSharedModule } from '../../projects/arlas-toolkit/src/public-api';
import { AppComponent } from './app.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DEFAULT_SHORTCUT_WIDTH, SHORTCUT_WIDTH } from '../../projects/arlas-toolkit/src/lib/tools/utils';

@NgModule({
  imports: [
    CommonModule,
    ArlasToolkitSharedModule,
    ArlasToolKitModule,
    MatIconModule,
    MatButtonModule
  ],
  exports: [AppComponent],
  declarations: [AppComponent],
  providers: [
    {provide: SHORTCUT_WIDTH, useValue: DEFAULT_SHORTCUT_WIDTH}
  ],
  bootstrap: [AppComponent]
})
export class ToolKitAppModule { }
