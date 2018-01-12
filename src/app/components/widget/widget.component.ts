import { Component, OnInit, Input, AfterViewInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ArlasStartupService } from '../../services/startup.services';
import { Contributor } from 'arlas-web-core'
import { contributors } from 'arlas-web-contributors';
import { ChartType, HistogramComponent } from 'arlas-web-components';
import { PowerbarsComponent } from 'arlas-web-components/powerbars/powerbars.component';

@Component({
  selector: 'arlas-tool-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.css']
})
export class WidgetComponent implements OnInit, AfterViewInit {

  public chartType = ChartType;
  public componentType;
  public contributor;
  @Input() public contributorId: string;
  @Input() public componentParams: Object;


  @ViewChild('histogram') private histogramComponent: HistogramComponent;
  @ViewChild('swimlane') private swimlaneComponent: HistogramComponent;
  @ViewChild('powerbars') private powerbarsComponent: PowerbarsComponent;

  constructor(private arlasStartupService: ArlasStartupService, private cdr: ChangeDetectorRef) {
  }

  public ngOnInit() {
    this.componentType = this.getComponentType();
    this.contributor = this.arlasStartupService.contributorRegistry.get(this.contributorId);

  }

  public ngAfterViewInit() {
    if (this.histogramComponent) {
      this.histogramComponent.chartTitle = 'HISTOGRAM'
      this.cdr.detectChanges();
    }
  }


  private getComponentType() {
    const contributor: Contributor = this.arlasStartupService.contributorRegistry.get(this.contributorId);
    if (contributor) {
      const contributorPkgName: string = contributor.getPackageName();
      const componenType: string = contributorPkgName.split(".")[contributorPkgName.split(".").length - 1];
      return componenType;
    }
  }




}

