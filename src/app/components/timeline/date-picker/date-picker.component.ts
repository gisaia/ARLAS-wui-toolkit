import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import * as _moment from 'moment';
import { DateTimeAdapter, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { MomentDateTimeAdapter, OWL_MOMENT_DATE_TIME_ADAPTER_OPTIONS } from 'ng-pick-datetime-moment';
import { HistogramContributor } from 'arlas-web-contributors';
import { ArlasCollaborativesearchService, ArlasStartupService } from './../../../services/startup/startup.service';
import { TranslateService } from '@ngx-translate/core';
import { SelectedOutputValues } from 'arlas-web-contributors/models/models';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';

const moment = (_moment as any).default ? (_moment as any).default : _moment;
export const MY_CUSTOM_FORMATS = {
  parseInput: 'lll',
  fullPickerInput: 'll LTS',
  datePickerInput: 'lll',
  timePickerInput: 'lll',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'lll',
  monthYearA11yLabel: 'MMMM YYYY',
};
@Component({
  selector: 'arlas-tool-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css'],
  providers: [
    { provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE] },
    { provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS },
  ]
})
export class DatePickerComponent implements OnInit, OnChanges {


  @Input()
  public startSelectedMoment;
  @Input()
  public endSelectedMoment;
  @Input()
  public timelineComponent: any;

  public timelineContributor: HistogramContributor;

  constructor(private arlasCollaborativesearchService: ArlasCollaborativesearchService,
    private arlasStartupService: ArlasStartupService,
    public translate: TranslateService) {

  }

  public ngOnInit() {
    if (this.timelineComponent) {
      this.timelineContributor = this.arlasStartupService.contributorRegistry.get(this.timelineComponent.contributorId);
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['startSelectedMoment'] !== undefined) {
      this.startSelectedMoment = moment.utc(changes['startSelectedMoment'].currentValue);
    }
    if (changes['endSelectedMoment'] !== undefined) {
      this.endSelectedMoment = moment.utc((changes['endSelectedMoment'].currentValue));
    }
  }

  public setDate(e): void {
    const selectedIntervalsList = new Array<SelectedOutputValues>();
    this.timelineContributor.intervalListSelection.forEach(intervalSelection => {
      selectedIntervalsList.push(intervalSelection);
    });
    selectedIntervalsList
    .push({ startvalue: moment.utc(this.startSelectedMoment).valueOf(), endvalue: moment.utc(this.endSelectedMoment).valueOf() });
    this.timelineContributor.valueChanged(selectedIntervalsList);
  }

}
