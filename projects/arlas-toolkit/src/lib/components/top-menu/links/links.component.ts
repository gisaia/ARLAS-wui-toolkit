import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { ArlasSettingsService } from '../../../services/settings/arlas.settings.service';
import { LinkSettings } from '../../../services/startup/startup.service';

@Component({
  selector: 'arlas-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.scss']
})
export class LinksComponent implements OnInit {

  @HostListener('click')
  public clickInside($event) {
    $event.stopPropagation();
  }

  @HostListener('document:click')
  public clickOutside() {
    this.close$.emit();
  }

  @Output() public close$: EventEmitter<void> = new EventEmitter();

  public links: LinkSettings[];
  public nbHidden = 0;
  private nbChecked = 0;
  public showSpinner = true;

  public constructor(private settingsService: ArlasSettingsService) {
    this.links = this.settingsService.getLinksSettings();
  }

  public ngOnInit(): void {
    this.showSpinner = true;
  }

  public onLinkChecked() {
    this.nbChecked++;
    this.showSpinner = !this.links || (this.nbChecked !== this.links.length);
  }

  public onLinkHidden() {
    this.nbHidden++;
  }

  public onLinkClicked() {
    this.close$.emit();
  }
}
