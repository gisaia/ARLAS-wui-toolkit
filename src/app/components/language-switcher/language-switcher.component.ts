import { OnInit, Component, Input } from '@angular/core';

@Component({
  selector: 'arlas-language-switcher',
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.css']
})
export class LanguageSwitcherComponent implements OnInit {

  @Input() public availablesLanguages: string[];

  public ngOnInit() {

  }

  public setLanguage(lang: string) {
    let newLg;
    if (window.location.search) {
      if (window.location.search.indexOf('lg') !== -1) {
        newLg = window.location.search.replace(/lg=(\w+)/, 'lg=' + lang);
      } else {
        newLg = window.location.search + '&lg=' + lang;
      }
    } else {
      newLg = '?lg=' + lang;
    }
    const newUrl = window.location.host + window.location.pathname + newLg;

    window.location.replace('http://' + newUrl);
  }
}


