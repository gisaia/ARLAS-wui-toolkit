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

import { HttpClient } from '@angular/common/http';
import { enableProdMode, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideTranslateService, TranslateLoader } from '@ngx-translate/core';
import { ArlasToolkitSharedModule } from '../projects/arlas-toolkit/src/lib/shared.module';
import { ArlasToolKitModule } from '../projects/arlas-toolkit/src/lib/toolkit.module';
import { CustomTranslateLoader } from '../projects/arlas-toolkit/src/lib/tools/Translation/custom-translate-loader';
import { AppRoutingModule } from './app/app-routing.module';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      AppRoutingModule,
      ArlasToolkitSharedModule,
      ArlasToolKitModule
    ),
    provideTranslateService({
      loader: {
        provide: TranslateLoader,
        useClass: CustomTranslateLoader,
        deps: [HttpClient]
      }
    }),
    provideZoneChangeDetection()
  ]
})
  .catch(err => console.log(err));
