import { Injectable } from '@angular/core';
import { ArlasSettings, LinkSettings } from '../startup/startup.service';
import { PersistenceSetting } from '../persistence/persistence.service';
import { PermissionSetting } from '../permission/permission.service';

@Injectable({
  providedIn: 'root'
})
export class ArlasSettingsService {
  public settings: ArlasSettings;

  public constructor() { }

  public setSettings(settings: ArlasSettings): void {
    this.settings = settings;
  }

  public getSettings(): ArlasSettings {
    return this.settings;
  }

  public getPersistenceSettings(): PersistenceSetting {
    return !!this.settings && !!this.settings.persistence ? this.settings.persistence : undefined;
  }

  public getPermissionSettings(): PermissionSetting {
    return !!this.settings && !!this.settings.permission ? this.settings.permission : undefined;
  }

  public getArlasWuiUrl(): string {
    return !!this.settings && !!this.settings.arlas_wui_url ? this.settings.arlas_wui_url : undefined;
  }

  public getArlasBuilderUrl(): string {
    return !!this.settings && !!this.settings.arlas_builder_url ? this.settings.arlas_builder_url : undefined;
  }

  public getArlasHubUrl(): string {
    return !!this.settings && !!this.settings.arlas_hub_url ? this.settings.arlas_hub_url : undefined;
  }

  public getLinksSettings(): LinkSettings[] {
    return !!this.settings && !!this.settings.links ? this.settings.links : undefined;
  }

  public getTicketingKey(): string {
    return !!this.settings && !!this.settings.ticketing_key && this.settings.ticketing_key !== '' ? this.settings.ticketing_key : undefined;
  }
}
