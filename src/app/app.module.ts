import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ArlasStartupService, ArlasConfigService, ArlasCollaborativesearchService } from './services/startup.services';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { ConfigService, CollaborativesearchService } from 'arlas-web-core';
import { AppComponent } from './app.component';
import { ErrormodalComponent, ErrorModalMsgComponent } from './components/errormodal/errormodal.component';
import { MatDialogModule } from '@angular/material';
export function startupServiceFactory(startupService: ArlasStartupService) {
  const load = () => startupService.load('config.json');
  return load;
}
@NgModule({
  declarations: [
    AppComponent,
    ErrormodalComponent,
    ErrorModalMsgComponent
  ],
  exports: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatDialogModule,
    CommonModule,
    HttpModule

  ],
  providers: [
    ArlasConfigService,
    ArlasCollaborativesearchService,
    ArlasStartupService,
    {
      provide: APP_INITIALIZER,
      useFactory: startupServiceFactory,
      deps: [ArlasStartupService],
      multi: true
    }],
  bootstrap: [AppComponent],
  entryComponents: [ErrorModalMsgComponent],
})
export class ArlasToolKitModule { }
