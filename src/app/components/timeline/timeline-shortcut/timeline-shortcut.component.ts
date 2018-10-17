import { Component, OnInit, Input } from '@angular/core';
import { HistogramContributor } from 'arlas-web-contributors';
import { StringifiedTimeShortcut, SelectedOutputValues } from 'arlas-web-contributors/models/models';
import { ArlasCollaborativesearchService, ArlasStartupService } from './../../../services/startup/startup.service';
import { TranslateService } from '@ngx-translate/core';
import { OperationEnum } from 'arlas-web-core';

@Component({
  selector: 'arlas-timeline-shortcut',
  templateUrl: './timeline-shortcut.component.html',
  styleUrls: ['./timeline-shortcut.component.css']
})
export class TimelineShortcutComponent implements OnInit {
  @Input() public timelineComponent: any;
  @Input() public dateFormat: string;
  @Input() public activeDatePicker = false;


  public timelineContributor: HistogramContributor;
  public timeShortcuts: Array<StringifiedTimeShortcut>;
  public timeShortcutsMap: Map<string, Array<StringifiedTimeShortcut>>;
  public showRemoveIcon = false;
  public showShortcuts = false;
  public HIDE_SHOW = 'Show';
  public isShortcutSelected = false;

  constructor(private arlasCollaborativesearchService: ArlasCollaborativesearchService, private arlasStartupService: ArlasStartupService,
    public translate: TranslateService) {
    this.arlasCollaborativesearchService.collaborationBus.filter(c => (c.id === this.timelineComponent.contributorId || c.all))
      .subscribe(data => {
        if (this.timelineContributor.timeLabel !== undefined && this.timelineContributor.timeLabel.indexOf('to') === -1) {
          this.isShortcutSelected = true;
        } else {
          this.isShortcutSelected = false;
        }
      });

  }
  public ngOnInit() {
    if (this.timelineComponent) {
      this.timelineContributor = this.arlasStartupService.contributorRegistry.get(this.timelineComponent.contributorId);
      this.timeShortcuts = this.timelineContributor.timeShortcuts;
      this.timeShortcuts.forEach(shortcut => {
        shortcut.label = this.translate.instant(shortcut.label);
      });
      this.timeShortcutsMap = this.groupBy(this.timeShortcuts, shortcut => shortcut.type);
      this.setRemoveIconVisibility();
    }
  }

  public setShortcut(shortCut: StringifiedTimeShortcut): void {
    const selectedIntervalsList = new Array<SelectedOutputValues>();
    this.timelineContributor.intervalListSelection.forEach(intervalSelection => {
      selectedIntervalsList.push(intervalSelection);
    });
    selectedIntervalsList.push({ startvalue: shortCut.from, endvalue: shortCut.to });
    this.timelineContributor.valueChanged(selectedIntervalsList);
  }

  public getKeys(map): Array<string> {
    return Array.from(map.keys());
  }

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

  public removeTimelineCollaboration(): void {
    this.showRemoveIcon = false;
    this.isShortcutSelected = false;
    this.arlasCollaborativesearchService.removeFilter(this.timelineComponent.contributorId);
  }



  private setRemoveIconVisibility(): void {
    this.arlasCollaborativesearchService.collaborationBus.filter(c => (c.id === this.timelineComponent.contributorId || c.all))
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
