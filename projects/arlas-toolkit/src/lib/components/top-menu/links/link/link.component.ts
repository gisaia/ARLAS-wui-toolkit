import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { LinkSettings } from '../../../../services/startup/startup.service';
import { HttpClient } from '@angular/common/http';
import { GET_OPTIONS } from '../../../../tools/utils';
import { ErrorService } from '../../../../services/error/error.service';
import { Observable, finalize } from 'rxjs';

@Component({
  selector: 'arlas-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.scss']
})
export class LinkComponent implements OnInit {

  @Input() public link: LinkSettings;
  @Output() public hidden$: EventEmitter<void> = new EventEmitter();
  @Output() public onCheck$: EventEmitter<void> = new EventEmitter();
  @Output() public onClick$: EventEmitter<void> = new EventEmitter();

  public show = false;
  public constructor(
    private http: HttpClient,
    @Inject(GET_OPTIONS) private getOptions,
  ) { }

  public ngOnInit(): void {
    this.http.get(this.link.check_url, this.getOptions())
      .pipe(finalize(() => this.onCheck$.emit()))
      .subscribe({
        next: () => {
          this.show = true;
        },
        error: () => {
          this.show = false;
          this.hidden$.emit();
        }
      });
  }

  public navigateTo(url) {
    if (url) {
      window.open(url);
    }
    this.onClick$.emit();
  }
}
