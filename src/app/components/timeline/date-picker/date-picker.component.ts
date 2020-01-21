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

/**
 * The component allows to set start/end values of a temporal selection on the timeline
 */
@Component({
  selector: 'arlas-tool-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css'],
  providers: [
    { provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE] }
  ]
})
export class DatePickerComponent implements OnInit, OnChanges {

  /**
   * @Input : Angular
   * @description Start value of the date picker. It must be date or a timestamp.
   */
  @Input()
  public startSelectedMoment: _moment.Moment | Date | number;
  /**
   * @Input : Angular
   * @description End value of the date picker. It must be date or a timestamp.
   */
  @Input()
  public endSelectedMoment: _moment.Moment | Date | number;
  /**
   * @Input : Angular
   * @description In this object, all the necessary inputs of HistogramComponent (ARLAS-web-components)
   * must be set as well as the identifier of the contributor that fetches timeline data. The `HistogramContributor`
   * should be declared before in the `contributorRegistry` of `ArlasStartupService`.
   */
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

  /**
   * Applies a temporal filter on the timeline on date selection on the date picker
   */
  public setDate(): void {
    const selectedIntervalsList = new Array<SelectedOutputValues>();
    this.startSelectedMoment = moment(this.startSelectedMoment).utc(true);
    this.endSelectedMoment = moment(this.endSelectedMoment).utc(true);
    this.timelineContributor.intervalListSelection.forEach(intervalSelection => {
      selectedIntervalsList.push(intervalSelection);
    });
    selectedIntervalsList
      .push({ startvalue: moment.utc(this.startSelectedMoment).valueOf(), endvalue: moment.utc(this.endSelectedMoment).valueOf() });
    this.timelineContributor.valueChanged(selectedIntervalsList);
  }

}
