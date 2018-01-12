import { Component, OnInit, Input, AfterViewInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ArlasStartupService } from '../../services/startup.services';
import { Contributor } from 'arlas-web-core'
import { contributors } from 'arlas-web-contributors';
import { ChartType, HistogramComponent,Position } from 'arlas-web-components';
import { PowerbarsComponent } from 'arlas-web-components/powerbars/powerbars.component';
import { DataType, DateUnit } from 'arlas-web-contributors/models/models';

@Component({
  selector: 'arlas-tool-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.css']
})
export class WidgetComponent implements OnInit, AfterViewInit {

  public chartType = ChartType;
  public dataType = DataType;
  public dateUnit = DateUnit;
  public position = Position;

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
      this.histogramComponent.chartTitle = 'Number of products over time per week';
      this.histogramComponent.xTicks =7;
      this.histogramComponent.barWeight=0.8;
      this.histogramComponent.yTicks=2;
      this.histogramComponent.xLabels=7;
      this.histogramComponent.chartType=this.chartType.bars;
      this.histogramComponent.dataType = this.dataType.time;
      this.histogramComponent.customizedCssClass = 'custom-effideo-timeline';
      this.histogramComponent.chartHeight =100;
      this.histogramComponent.dataUnit = this.dateUnit.millisecond.toString();
      this.histogramComponent.intervalListSelection = this.contributor.intervalListSelection;
      this.histogramComponent.intervalSelection = this.contributor.intervalSelection;
      this.histogramComponent.data = this.contributor.charData;
      this.histogramComponent.multiselectable = true;
      this.histogramComponent.xAxisPosition = this.position.top;
      this.histogramComponent.descriptionPosition = this.position.top;
      this.histogramComponent.valuesListChangedEvent.subscribe(event=>this.contributor.valueChanged(event));
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

