import { AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ArlasConfigService, ArlasCollaborativesearchService, ArlasStartupService } from './services/startup.service';
import { MatDialogRef, MatDialog } from '@angular/material';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'arlas-tool-root',
  templateUrl: './app.component.html',
  providers: [Location],
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit, OnInit {

  // public analytics: Array<any>;
  constructor(private configService: ArlasConfigService,
    private arlasStartupService: ArlasStartupService,
    private collaborativeService: ArlasCollaborativesearchService,
    private cdr: ChangeDetectorRef, private activatedRoute: ActivatedRoute,
    private router: Router, private location: Location) {

    // update url when filter are setted
    const queryParams: Params = Object.assign({}, this.activatedRoute.snapshot.queryParams);
    this.collaborativeService.collaborationBus.subscribe(collaborationEvent => {
      queryParams['filter'] = this.collaborativeService.urlBuilder().split('=')[1];
      if (collaborationEvent.id !== 'url') {
        this.router.navigate(['.'], { queryParams: queryParams });
      }
    });

  }

  public ngOnInit(): void {
    // update app when user click on back/next browser button
    this.location.subscribe(x => {
      const dataModel = this.collaborativeService.dataModelBuilder(decodeURI(x.url.split('filter=')[1]));
      this.collaborativeService.setCollaborations(dataModel);
    });
  }

  public ngAfterViewInit(): void {
    if (this.configService.getConfig()['error'] !== undefined) {
      this.configService.confErrorBus.next(this.configService.getConfig()['error']);
    } else {

      this.activatedRoute.queryParams
        .pairwise()
        .take(1)
        .timeoutWith(400, Observable.of('initWithoutFilter'))
        .subscribe((params) => {
          if (params.toString() === 'initWithoutFilter') {
            this.collaborativeService.setCollaborations({});
          } else {
            const dataModel = this.collaborativeService.dataModelBuilder(params[1]['filter']);
            this.collaborativeService.setCollaborations(dataModel);
          }
        });

      // this.collaborativeService.setCollaborations({});
      // this.analytics = this.arlasStartupService.analytics;
      // this.cdr.detectChanges();
    }
  }
}



