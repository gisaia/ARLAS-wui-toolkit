import { Component, Input, OnInit } from '@angular/core';
import { FilterShortcutConfiguration } from './filter-shortcut.utils';
import { ArlasCollaborativesearchService, ArlasConfigService } from '../../services/startup/startup.service';
import { OperationEnum, Contributor } from 'arlas-web-core';


@Component({
  selector: 'arlas-filter-shortcut',
  templateUrl: './filter-shortcut.component.html',
  styleUrls: ['./filter-shortcut.component.css']
})
export class FilterShortcutComponent implements OnInit {

  @Input() public shortcut: FilterShortcutConfiguration;

  public isOpen = false;

  public constructor(private collaborativeSearchService: ArlasCollaborativesearchService) {

  }

  public ngOnInit(): void {
    if (this.isOpen) {
      this.activateContributor();
    }
  }

  public toggle() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.triggerContributorCollaboration();
    }
  }

  private activateContributor(): Contributor {
    const contributor: Contributor = this.collaborativeSearchService.registry.get(this.shortcut.component.contributorId);
    contributor.updateData = true;
    return contributor;
  }

  private triggerContributorCollaboration() {
    const c = this.activateContributor();
    c.updateFromCollaboration({
      id: c.linkedContributorId,
      operation: OperationEnum.add,
      all: false
    });
  }
}
