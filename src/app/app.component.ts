import { AfterViewInit } from '@angular/core/core';
import { Component, OnInit } from '@angular/core';
import { ArlasConfigService, ArlasCollaborativesearchService } from './services/startup.services';
import { MatDialogRef, MatDialog } from '@angular/material';

@Component({
  selector: 'arlas-tool-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  public dialogRef: MatDialogRef<any>;

  constructor(public dialog: MatDialog,private configService: ArlasConfigService,
    private collaborativeService: ArlasCollaborativesearchService) {


  }

  public ngOnInit() {


  }


  public ngAfterViewInit(): void {
    if (this.configService.getConfig()['error'] !== undefined) {
      this.configService.confErrorBus.next(this.configService.getConfig()['error'])
    } 
  }
}



