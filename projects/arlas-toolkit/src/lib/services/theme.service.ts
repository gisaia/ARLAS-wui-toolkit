import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkMode = signal(false);
  private readonly THEME_KEY = 'dark-theme-enabled';

  public constructor() {
    // Load saved preference
    const saved = localStorage.getItem(this.THEME_KEY);
    this.darkMode.set(saved === 'true');
    if (this.darkMode()) {
      document.body.classList.add('dark-theme');
    }
  }

  /**
   * Toggle theme between dark and light mode
   * save the current choice in localstorage
   */
  public toggleThemeMode() {
    const body = document.body;

    this.darkMode.set(!this.darkMode());
    localStorage.setItem(this.THEME_KEY, this.darkMode().toString());

    if (this.darkMode()) {
      body.classList.add('dark-theme');
    } else {
      body.classList.remove('dark-theme');
    }
  }

  public isDarkMode() {
    return this.darkMode();
  }
}
