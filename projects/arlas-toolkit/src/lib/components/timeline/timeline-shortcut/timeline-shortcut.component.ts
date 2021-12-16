import { Component, OnInit, Input } from '@angular/core';
import { HistogramContributor } from 'arlas-web-contributors';
import { StringifiedTimeShortcut, SelectedOutputValues } from 'arlas-web-contributors/models/models';
import { ArlasCollaborativesearchService, ArlasStartupService } from '../../../services/startup/startup.service';
import { TranslateService } from '@ngx-translate/core';
import { OperationEnum } from 'arlas-web-core';
import { filter } from 'rxjs/operators';

/**
 * This component contains shortcut labels that allow to apply predefined temporal filters on a timeline
 * (Last year, Last month, Today, etc ...).
 * It also displays the start and end values of the current selection on the timeline. And if enabled, a datepicker is allowed on those
 * start and end values.
 * This component is used internally in `TimelineComponent`
 */
@Component({
  selector: 'arlas-timeline-shortcut',
  templateUrl: './timeline-shortcut.component.html',
  styleUrls: ['./timeline-shortcut.component.css']
})
export class TimelineShortcutComponent implements OnInit {
   /**
   * @Input : Angular
   * @description In this object, all the necessary inputs of HistogramComponent (ARLAS-web-components)
   * must be set as well as the identifier of the contributor that fetches timeline data. The `HistogramContributor`
   * should be declared before in the `contributorRegistry` of `ArlasStartupService`
   */
  @Input() public timelineComponent: any;
  /**
   * @Input : Angular
   * @description Optional input. Sets the format of start/end date values of the timeline.
   */
  @Input() public dateFormat: string;
  /**
   * @Input : Angular
   * @description Whether the date picker is enabled
   */
  @Input() public activeDatePicker = false;

  public timelineContributor: HistogramContributor;
  public timeShortcuts: Array<StringifiedTimeShortcut>;
  public timeShortcutsMap: Map<string, Array<StringifiedTimeShortcut>>;
  public showRemoveIcon = false;
  public showShortcuts = false;
  public HIDE_SHOW = 'Show';
  public isShortcutSelected = false;
  public timeZone = 'UTC';

  constructor(private arlasCollaborativesearchService: ArlasCollaborativesearchService, private arlasStartupService: ArlasStartupService,
    public translate: TranslateService) {
    this.arlasCollaborativesearchService.collaborationBus.pipe(filter(c => ((this.timelineComponent
      && c.id === this.timelineComponent.contributorId) || c.all)))
      .subscribe(data => {
        if (this.timelineContributor && this.timelineContributor.timeLabel !== undefined
          && this.timelineContributor.timeLabel.indexOf('to') === -1) {
          this.isShortcutSelected = true;
        } else {
          this.isShortcutSelected = false;
        }
      });

  }
  public ngOnInit() {
    if (this.timelineComponent) {
      this.timelineContributor = <HistogramContributor>this.arlasStartupService.contributorRegistry
        .get(this.timelineComponent.contributorId);
      this.timeShortcuts = this.timelineContributor.timeShortcuts;
      this.timeShortcutsMap = this.groupBy(this.timeShortcuts, shortcut => shortcut.type);
      this.setRemoveIconVisibility();
      if (!this.timelineComponent.input.useUtc) {
        this.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      }
    }
  }

  /**
   * Applies a temporal filter on timeline according to the chosen shortcut.
   * @param shortCut
   */
  public setShortcut(shortCut: StringifiedTimeShortcut): void {
    const selectedIntervalsList = new Array<SelectedOutputValues>();
    if (this.timelineContributor) {
      this.timelineContributor.intervalListSelection.forEach(intervalSelection => {
        selectedIntervalsList.push(intervalSelection);
      });
      selectedIntervalsList.push({ startvalue: shortCut.from, endvalue: shortCut.to });
      this.timelineContributor.valueChanged(selectedIntervalsList);
    }
  }

  /**
   * Shows/hides the `div` containing the shortcuts list
   */
  public showSortcuts(): void {
    if (this.timeShortcuts && this.timeShortcuts.length > 0) {
      this.showShortcuts = !this.showShortcuts;
      if (this.showShortcuts) {
        this.HIDE_SHOW = 'Hide';
      } else {
        this.HIDE_SHOW = 'Show';
      }
    }
  }

  /**
   * Removes all temporal filters of the timeline
   */
  public removeTimelineCollaboration(): void {
    this.showRemoveIcon = false;
    this.isShortcutSelected = false;
    this.arlasCollaborativesearchService.removeFilter(this.timelineComponent.contributorId);
  }

  /**
   * Gets the list of keys of a Typescript map
   * @param map
   */
  public getKeys(map): Array<string> {
    return Array.from(map.keys());
  }

  /**
   * Shows or hides the icon that allows to clear all temporal filter. This icon is displayed when there filters on the timeline.
   */
  private setRemoveIconVisibility(): void {
    this.arlasCollaborativesearchService.collaborationBus.pipe(filter(c => (c.id === this.timelineComponent.contributorId || c.all)))
      .subscribe(c => {
        if (c.operation === OperationEnum.remove) {
          this.showRemoveIcon = false;
        } else if (c.operation === OperationEnum.add &&
          this.arlasCollaborativesearchService.collaborations.has(this.timelineComponent.contributorId)) {
          this.showRemoveIcon = true;
        }
      });
  }

  private groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
      const key = keyGetter(item);
      const collection = map.get(key);
      if (!collection) {
        map.set(key, [item]);
      } else {
        collection.push(item);
      }
    });
    return map;
  }
}
