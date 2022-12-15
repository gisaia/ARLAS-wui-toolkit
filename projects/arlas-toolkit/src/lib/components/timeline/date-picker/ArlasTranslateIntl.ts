import { TranslateService } from '@ngx-translate/core';
import { OwlDateTimeIntl } from '@danielmoncada/angular-datetime-picker';

// here is the default text string
export class ArlasTranslateIntl extends OwlDateTimeIntl {

  /** A label for the up second button (used by screen readers).  */
  public upSecondLabel = this.translateService.instant('Datepicker.upSecondLabel');

  /** A label for the down second button (used by screen readers).  */
  public downSecondLabel = this.translateService.instant('Datepicker.downSecondLabel');

  /** A label for the up minute button (used by screen readers).  */
  public upMinuteLabel = this.translateService.instant('Datepicker.upMinuteLabel');

  /** A label for the down minute button (used by screen readers).  */
  public downMinuteLabel = this.translateService.instant('Datepicker.downMinuteLabel');

  /** A label for the up hour button (used by screen readers).  */
  public upHourLabel = this.translateService.instant('Datepicker.upHourLabel');

  /** A label for the down hour button (used by screen readers).  */
  public downHourLabel = this.translateService.instant('Datepicker.downHourLabel');

  /** A label for the previous month button (used by screen readers). */
  public prevMonthLabel = this.translateService.instant('Datepicker.prevMonthLabel');

  /** A label for the next month button (used by screen readers). */
  public nextMonthLabel = this.translateService.instant('Datepicker.nextMonthLabel');

  /** A label for the previous year button (used by screen readers). */
  public prevYearLabel = this.translateService.instant('Datepicker.prevYearLabel');

  /** A label for the next year button (used by screen readers). */
  public nextYearLabel = this.translateService.instant('Datepicker.nextYearLabel');

  /** A label for the previous multi-year button (used by screen readers). */
  public prevMultiYearLabel = this.translateService.instant('Datepicker.prevMultiYearLabel');

  /** A label for the next multi-year button (used by screen readers). */
  public nextMultiYearLabel = this.translateService.instant('Datepicker.nextMultiYearLabel');

  /** A label for the 'switch to month view' button (used by screen readers). */
  public switchToMonthViewLabel = this.translateService.instant('Datepicker.switchToMonthViewLabel');

  /** A label for the 'switch to year view' button (used by screen readers). */
  public switchToMultiYearViewLabel = this.translateService.instant('Datepicker.switchToMultiYearViewLabel');

  /** A label for the cancel button */
  public cancelBtnLabel = this.translateService.instant('Datepicker.cancelBtnLabel');

  /** A label for the set button */
  public setBtnLabel = this.translateService.instant('Datepicker.setBtnLabel');

  /** A label for the range 'from' in picker info */
  public rangeFromLabel = this.translateService.instant('Datepicker.rangeFromLabel');

  /** A label for the range 'to' in picker info */
  public rangeToLabel = this.translateService.instant('Datepicker.rangeToLabel');

  /** A label for the hour12 button (AM) */
  public hour12AMLabel = this.translateService.instant('Datepicker.hour12AMLabel');

  /** A label for the hour12 button (PM) */
  public hour12PMLabel = this.translateService.instant('Datepicker.hour12PMLabel');

  public constructor(private translateService: TranslateService) {
    super();
  }
}
