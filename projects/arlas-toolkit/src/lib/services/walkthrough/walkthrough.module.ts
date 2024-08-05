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

import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { ArlasWalkthroughService } from './walkthrough.service';
import { BasicWalkthroughLoader, WalkthroughLoader } from './walkthrough.utils';
import { HttpClient } from '@angular/common/http';

export interface WalkthroughModuleConfig {
  loader?: Provider;
}

@NgModule({

})
export class ArlasWalkthroughModule {

  /**
   * Use this method in your root module to provide the ColorGeneratorLoader
   */
  public static forRoot(config: WalkthroughModuleConfig = {}): ModuleWithProviders<ArlasWalkthroughModule> {
    return {
      ngModule: ArlasWalkthroughModule,
      providers: [
        config.loader || { provide: WalkthroughLoader, useClass: BasicWalkthroughLoader, deps: [HttpClient] },
        ArlasWalkthroughService
      ]
    };
  }

  public static forChild(config: WalkthroughModuleConfig = {}): ModuleWithProviders<ArlasWalkthroughModule> {
    return {
      ngModule: ArlasWalkthroughModule,
      providers: [
        config.loader || { provide: WalkthroughLoader, useClass: BasicWalkthroughLoader, deps: [HttpClient] },
        ArlasWalkthroughService
      ]
    };
  }

}
