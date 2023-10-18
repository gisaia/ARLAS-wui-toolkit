import { OnInit, Component, Input } from '@angular/core';
import { getParamValue } from '../../tools/utils';

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

  @Input() public currentLanguage: string;

  public constructor() {
  }

  public ngOnInit() {
    this.currentLanguage = navigator.language.slice(0, 2);
    const urlLanguage = getParamValue('lg');
    if (urlLanguage) {
      this.currentLanguage = decodeURIComponent(urlLanguage.replace(/\+/g, ' '));
    }
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


