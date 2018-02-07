import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ArlasStartupService, ArlasConfigService, ArlasCollaborativesearchService } from './services/startup/startup.service';
import { NgModule, APP_INITIALIZER, forwardRef } from '@angular/core';
import { ConfigService, CollaborativesearchService } from 'arlas-web-core';
import { AppComponent } from './app.component';
import { ErrormodalComponent, ErrorModalMsgComponent } from './components/errormodal/errormodal.component';
import {
  MatDialogModule, MatCard, MatCardModule, MatSelectModule,
  MatExpansionModule, MatIconModule, MatRadioModule, MatStepperModule, MatButtonModule
} from '@angular/material';
import { WidgetComponent } from './components/widget/widget.component';
import { HistogramModule } from 'arlas-web-components/histogram/histogram.module';
import { PowerbarsModule } from 'arlas-web-components/powerbars/powerbars.module';
import { AnalyticsBoardComponent } from './components/analytics-board/analytics-board.component';
import { ArlasBookmarkService } from './services/bookmark/bookmark.service';
import { RouterModule } from '@angular/router';
import { routing } from './app.routes';
import { ResultsModule } from 'arlas-web-components/results/results.module';
import { ShareComponent, ShareDialogComponent } from './components/share/share.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExcludeTypePipe } from './components/share/exclude-type.pipe';
import { ClipboardModule } from 'ngx-clipboard';

export function startupServiceFactory(startupService: ArlasStartupService) {
  const load = () => startupService.load('config.json');
  return load;
}
@NgModule({
  declarations: [
    AppComponent,
    ErrormodalComponent,
    ErrorModalMsgComponent,
    WidgetComponent,
    AnalyticsBoardComponent,
    ShareComponent,
    ShareDialogComponent,
    ExcludeTypePipe
  ],
  exports: [AppComponent, WidgetComponent, AnalyticsBoardComponent, ShareComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ClipboardModule,
    CommonModule,
    FormsModule,
    HistogramModule,
    HttpModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatExpansionModule,
    MatIconModule,
    MatSelectModule,
    MatStepperModule,
    MatRadioModule,
    PowerbarsModule,
    ReactiveFormsModule,
    ResultsModule,
    RouterModule,
    routing,
  ],
  providers: [
    forwardRef(() => ArlasConfigService),
    forwardRef(() => ArlasCollaborativesearchService),
    forwardRef(() => ArlasStartupService),
    forwardRef(() => ArlasBookmarkService),

    {
      provide: APP_INITIALIZER,
      useFactory: startupServiceFactory,
      deps: [ArlasStartupService],
      multi: true
    }],
  bootstrap: [AppComponent],
  entryComponents: [ErrorModalMsgComponent, ShareDialogComponent],
})
export class ArlasToolKitModule { }
