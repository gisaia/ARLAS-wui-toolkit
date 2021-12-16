import { Component, OnInit } from '@angular/core';
import { LinkSettings } from '../../services/startup/startup.service';
import { ArlasSettingsService } from '../../services/settings/arlas.settings.service';

@Component({
  selector: 'arlas-tool-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.css']
})
export class LinkComponent implements OnInit {

  public links: LinkSettings[];

  constructor(private settings: ArlasSettingsService) { }

  public ngOnInit() {
    this.links = this.settings.getLinksSettings();
  }

  public navigateTo(url: string) {
    window.open(url);
  }

}
