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
import { ArlasToolkitSharedModule } from '../../projects/arlas-toolkit/src/lib/shared.module';
import { ArlasToolKitModule } from '../../projects/arlas-toolkit/src/lib/toolkit.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatIconModule } from '@angular/material/icon';
import { ContactComponent } from './components/contact/contact.component';
import { HomeComponent } from './components/home/home.component';
import { LoginModule } from '../../projects/arlas-toolkit/src/lib/login.module';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  imports: [
    CommonModule,
    AppRoutingModule,
    ArlasToolkitSharedModule,
    ArlasToolKitModule,
    MatIconModule,
    MatButtonModule,
    LoginModule,
    RouterModule,
    MatMenuModule,
    MatSelectModule
  ],
  exports: [AppComponent],
  declarations: [AppComponent, HomeComponent, ContactComponent],
  bootstrap: [AppComponent]
})
export class ToolKitAppModule { }
