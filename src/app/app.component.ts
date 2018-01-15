import { AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ArlasConfigService, ArlasCollaborativesearchService, ArlasStartupService } from './services/startup.services';
import { MatDialogRef, MatDialog } from '@angular/material';

@Component({
  selector: 'arlas-tool-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  public analytics: Array<any>
  constructor(private configService: ArlasConfigService,
    private arlasStartupService:ArlasStartupService,
    private collaborativeService: ArlasCollaborativesearchService, private cdr: ChangeDetectorRef) { }

  public ngAfterViewInit(): void {
    if (this.configService.getConfig()['error'] !== undefined) {
      this.configService.confErrorBus.next(this.configService.getConfig()['error']);
    } else {
      this.collaborativeService.setCollaborations({});
      this.analytics = this.arlasStartupService.analytics;
      this.cdr.detectChanges();
    }
  }
}



