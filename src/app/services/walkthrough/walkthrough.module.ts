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
  public static forRoot(config: WalkthroughModuleConfig = {}): ModuleWithProviders {
    return {
      ngModule: ArlasWalkthroughModule,
      providers: [
        config.loader || { provide: WalkthroughLoader, useClass: BasicWalkthroughLoader, deps: [HttpClient] },
        ArlasWalkthroughService
      ]
    };
  }

  public static forChild(config: WalkthroughModuleConfig = {}): ModuleWithProviders {
    return {
      ngModule: ArlasWalkthroughModule,
      providers: [
        config.loader || { provide: WalkthroughLoader, useClass: BasicWalkthroughLoader, deps: [HttpClient] },
        ArlasWalkthroughService
      ]
    };
  }

}
