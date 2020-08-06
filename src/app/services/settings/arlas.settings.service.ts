import { Injectable } from '@angular/core';
import { ArlasSettings } from '../startup/startup.service';
import { PersistenceSetting } from '../persistence/persistence.service';

@Injectable({
  providedIn: 'root'
})
export class ArlasSettingsService {
  public settings: ArlasSettings;

  constructor() {}

  public setSettings(settings: ArlasSettings): void {
    this.settings = settings;
  }

  public getPersistenceSettings(): PersistenceSetting {
    return !!this.settings && !!this.settings.persistence ? this.settings.persistence : undefined;
  }
}
