import { OnInit, Component, Input } from '@angular/core';

/**
 * This component changes the `lg` parameter of ARLAS-wui url.
 */
@Component({
  selector: 'arlas-language-switcher',
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.css']
})
export class LanguageSwitcherComponent implements OnInit {
  /**
   * @Input : Angular
   * @description List of available languages for translation
   */
  @Input() public availablesLanguages: string[];

  public ngOnInit() {

  }

  /**
   * Sets the given language in `lg` parameter of ARLAS-wui url
   * @param lang Language name
   */
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


