import { Injectable, Inject } from '@angular/core';
import { AuthorizeApi, Configuration, Resource } from 'arlas-permissions-api';
import { GET_OPTIONS } from '../persistence/persistence.service';
import { ArlasSettingsService } from '../settings/arlas.settings.service';
import { from } from 'rxjs/internal/observable/from';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  private authorizeApi: AuthorizeApi;
  private options;

  constructor(
    @Inject(GET_OPTIONS) private getOptions,
    private settingsService: ArlasSettingsService
  ) {
    this.setOptions(this.getOptions());
    this.createPermissionApiInstance();
  }

  public setOptions(options): void {
    this.options = options;
  }

  public createPermissionApiInstance(): void {
    const permissionSettings = this.settingsService.getPermissionSettings();
    if (!this.authorizeApi && !!permissionSettings) {
      const configuration = new Configuration();
      this.authorizeApi = new AuthorizeApi(configuration, permissionSettings.url, window.fetch);
    }
  }

  public get(filter: string): Observable<Resource[]> {
    return from(this.authorizeApi.get(filter, false, this.options));
  }
}

export interface PermissionSetting {
  url: string;
}
