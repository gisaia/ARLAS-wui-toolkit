import { Injectable } from '@angular/core';
import { ArlasSettings, ArlasServerSetting, ArlasTaggerSetting } from '../startup/startup.service';
import { PersistenceSetting } from '../persistence/persistence.service';

@Injectable({
  providedIn: 'root'
})
export class ArlasSettingsService {
  public settings: ArlasSettings;

  constructor() { }

  public setSettings(settings: ArlasSettings): void {
    this.settings = settings;
  }

  public getPersistenceSettings(): PersistenceSetting {
    return !!this.settings && !!this.settings.persistence ? this.settings.persistence : undefined;
  }

  public getServerSettings(): ArlasServerSetting {
    return !!this.settings && !!this.settings.server ? this.settings.server : undefined;
  }

  public getTaggerSettings(): ArlasTaggerSetting {
    return !!this.settings && !!this.settings.tagger ? this.settings.tagger : undefined;
  }

  public getArlasWuiUrl(): string {
    return !!this.settings && !!this.settings.arlas_wui_url ? this.settings.arlas_wui_url : undefined;
  }

  public getArlasBuilderUrl(): string {
    return !!this.settings && !!this.settings.arlas_builder_url ? this.settings.arlas_builder_url : undefined;
  }
}
